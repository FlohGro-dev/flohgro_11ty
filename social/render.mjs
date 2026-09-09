// Turns a social-queue.json entry into the plain text that gets posted.
//
// Three stages, in this order:
//   1. markdownToPlain - the queue carries raw markdown source; EchoFeed posted
//      the plaintext rendering of content_html, so we approximate that.
//   2. renderTemplate  - the per-type Nunjucks template from social/config.json.
//   3. applyReplacements - the central @handle table, on the finished string so
//      the title is covered too.
//
// See docs/echofeed-migration.md.

import nunjucks from "nunjucks";

// autoescape off: this is plain text destined for an API, not HTML. With it on,
// every apostrophe in the corpus would come out as &#39;.
const env = new nunjucks.Environment(null, { autoescape: false });

// Matches a whole http(s) URL. Used to carve the text into replaceable and
// untouchable segments - a handle must never be rewritten inside a link, and
// the blog template's "link" line is a URL.
const URL_RE = /https?:\/\/[^\s<>]+/g;

/**
 * Approximate EchoFeed's `{{ content:plain }}`.
 *
 * Deliberately conservative. The corpus (334 items) contains no markdown links,
 * no inline code and no headings, but it does contain Mastodon handles with
 * underscores (`@matt_...`). Stripping single `*`/`_` emphasis would corrupt a
 * real handle to fix a construct that does not occur, so we do not do it.
 * List markers are also kept - they read correctly on Mastodon as-is.
 */
export function markdownToPlain(md) {
  if (!md) return "";
  let out = md;
  // [text](url) -> text. EchoFeed drops the target and keeps the label.
  out = out.replace(/\[([^\]]*)\]\(\s*[^)\s]*(?:\s+"[^"]*")?\s*\)/g, "$1");
  // ![alt](src) is already stripped by the socialQueue collection, but a stray
  // one would otherwise leave a bare "!" behind.
  out = out.replace(/!\[([^\]]*)\]\([^)]*\)/g, "");
  // **strong** / __strong__ -> strong
  out = out.replace(/\*\*([^*]+)\*\*/g, "$1");
  out = out.replace(/__([^_]+)__/g, "$1");
  // `code` -> code
  out = out.replace(/`([^`]+)`/g, "$1");
  // Leading blockquote and heading markers.
  out = out.replace(/^>[ \t]?/gm, "");
  out = out.replace(/^#{1,6}[ \t]+/gm, "");
  // Blockquote stripping can leave a run of blank lines behind.
  out = out.replace(/\n{3,}/g, "\n\n");
  return out.trim();
}

/**
 * Build the single regex used by applyReplacements.
 *
 * Longest find first, so a short key cannot consume a longer one - `@Craft`
 * must not win over a hypothetical `@CraftDocs`.
 */
function buildFindRegex(rows, caseInsensitive) {
  const escaped = rows
    .map((r) => r.find)
    .sort((a, b) => b.length - a.length)
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  // Boundaries, all of which the corpus forced:
  //
  //  (?<![\w.@-])  not preceded by a word char, dot, @ or hyphen. Stops the
  //                `@drafts` inside an address like `foo@drafts.com`.
  //  (?!\w)        not followed by a word char, or `@Craft` matches `@Crafty`.
  //  (?!@)         not followed by `@`. 14 items in the corpus already contain
  //                the fully-qualified handle (`@drafts@indieapps.space`,
  //                `@ChrisLawley@mastodon.social`) because FlohGro sometimes
  //                writes it out. Without this, `@Drafts` matches the prefix
  //                and yields `@drafts@indieapps.space@indieapps.space`.
  //  (?!\.\w)      not followed by a dot and a word char, so a bare domain like
  //                `@drafts.com` is left alone. A trailing sentence full stop
  //                (`@Craft.`) is followed by a non-word char and still matches.
  return new RegExp(
    `(?<![\\w.@-])(?:${escaped.join("|")})(?!\\w)(?!@)(?!\\.\\w)`,
    caseInsensitive ? "gi" : "g",
  );
}

/**
 * Apply the central replacement table for one target.
 *
 * Single left-to-right pass: one String.replace over one alternation regex.
 * The replacement text is never rescanned, which matters because several
 * replacements contain their own find string (`@11ty` -> `@11ty@neighborhood…`,
 * `@Viticci` -> `@viticci@…`). Any loop-until-stable implementation expands
 * forever on those.
 *
 * URLs are carved out first and rejoined untouched, matching EchoFeed.
 */
export function applyReplacements(text, rows, target, { caseInsensitive = true } = {}) {
  if (!text || !rows?.length) return text ?? "";

  const usable = rows.filter((r) => typeof r.replace?.[target] === "string");
  if (!usable.length) return text;

  const lookup = new Map(
    usable.map((r) => [caseInsensitive ? r.find.toLowerCase() : r.find, r.replace[target]]),
  );
  const re = buildFindRegex(usable, caseInsensitive);
  const swap = (segment) =>
    segment.replace(re, (m) => lookup.get(caseInsensitive ? m.toLowerCase() : m) ?? m);

  // Split on URLs, keeping them: even indices are replaceable, odd are URLs.
  const parts = text.split(new RegExp(`(${URL_RE.source})`, "g"));
  return parts.map((part, i) => (i % 2 === 0 ? swap(part) : part)).join("");
}

/** Render one type's template. Variables map to social-queue.json fields. */
export function renderTemplate(template, { title, text, url }) {
  return env.renderString(template, { title: title ?? "", text: text ?? "", url: url ?? "" });
}

/**
 * Full pipeline for one queue item and one target.
 * Returns { text, images } ready for a target's post().
 */
export function renderItem(item, config, target) {
  const type = config.types?.[item.type];
  if (!type) throw new Error(`No template configured for type "${item.type}" (${item.id})`);

  const plain = markdownToPlain(item.text);
  const rendered = renderTemplate(type.template, { ...item, text: plain });
  const text = applyReplacements(rendered, config.replacements, target, {
    caseInsensitive: config.replacementsCaseInsensitive !== false,
  });

  const maxImages = config.targets?.[target]?.maxImages ?? 4;
  const images = type.images ? (item.images ?? []).slice(0, maxImages) : [];

  return { text, images };
}
