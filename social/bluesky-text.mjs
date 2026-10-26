// Turns rendered post text into what Bluesky needs: at most 300 graphemes, plus
// "facets" - the byte ranges that make links and hashtags clickable. Bluesky
// does not detect them itself; unmarked text is plain text.
//
// Runs AFTER render.mjs, on its output, so the Mastodon path is never touched.
// Pure functions, no network - the preview script and the target share them.
//
// See docs/echofeed-migration.md, "Bluesky".

const MAX_GRAPHEMES = 300;
const MAX_BYTES = 3000;
const MAX_TAG_GRAPHEMES = 64;

const segmenter = new Intl.Segmenter();

/** Split into user-perceived characters, the unit Bluesky's limit counts. */
const segments = (text) => Array.from(segmenter.segment(text), (s) => s.segment);

export const graphemes = (text) => segments(text).length;

const byteLength = (text) => Buffer.byteLength(text, "utf8");

/**
 * Shorten to fit, ending in "…" and a link to the full post on flohgro.com.
 *
 * Cuts only at whitespace. URLs, @handles and #hashtags contain none, so a cut
 * can drop one entirely but never leave half of it behind.
 *
 * The end of a post is protected and only the text before it is cut
 * (FlohGro, 2026-10-19):
 *   - a last paragraph carrying the post URL - the blog template's "🔗 <url>"
 *     line - is kept instead of adding the URL a second time;
 *   - trailing paragraphs of only hashtags ("#RandomQuote", "#IndieApp #iOS");
 *   - a quote's "-- Author" line, with or without a blank line before it.
 */
export function shorten(text, url, { max = MAX_GRAPHEMES } = {}) {
  if (graphemes(text) <= max) return { text, shortened: false };

  const end = protectedStart(text, url);
  const body = text.slice(0, end);
  const keptEnd = text.slice(end);
  const suffix = "…" + keptEnd + (keptEnd.includes(url) ? "" : `\n\n🔗 ${url}`);
  const budget = max - graphemes(suffix);

  const chars = segments(body);
  // Walk back from the budget to a whitespace character: everything before it
  // is whole words.
  let cut = Math.min(Math.max(budget, 0), chars.length);
  while (cut > 0 && cut < chars.length && !/^\s+$/.test(chars[cut])) cut--;
  // "word, …" and "word. …" read badly; the … replaces the punctuation.
  const trim = (s) => s.replace(/[\s.,;:\-–—]+$/u, "");
  let kept = trim(chars.slice(0, cut).join(""));
  // A last line with no letters or digits was a label for something the cut
  // dropped - corpus: "📲 https://apps.apple.com/…" would leave "📲…".
  const lastLine = kept.slice(kept.lastIndexOf("\n") + 1);
  if (kept.includes("\n") && !/[\p{L}\p{N}]/u.test(lastLine)) {
    kept = trim(kept.slice(0, kept.lastIndexOf("\n")));
  }
  if (!kept) {
    throw new Error(`no space to cut at within ${budget} graphemes - cannot shorten without breaking a word or link`);
  }
  return { text: kept + suffix, shortened: true };
}

const isTagsOnly = (para) => para.trim().split(/\s+/).every((t) => t.startsWith("#")) && findTags(para).length > 0;
const isAuthorLine = (line) => /^\s*(--|–|—)\s*\S/.test(line);

/**
 * Index where the protected end of the text starts (see shorten). Peels from
 * the end: the URL paragraph, then hashtag paragraphs and an author line in any
 * order. The returned index sits before the separating newlines, so the kept
 * end carries its own spacing. Never protects the whole text.
 */
function protectedStart(text, url) {
  const back = (i) => {
    while (i > 0 && /\s/.test(text[i - 1])) i--;
    return i;
  };
  let end = text.length;
  const para = (e) => text.slice(0, e).lastIndexOf("\n\n");

  const p = para(end);
  if (p !== -1 && text.slice(p, end).includes(url)) end = back(p);

  for (;;) {
    const p = para(end);
    if (p !== -1 && isTagsOnly(text.slice(p, end))) {
      end = back(p);
      continue;
    }
    const l = text.slice(0, end).lastIndexOf("\n");
    if (l !== -1 && isAuthorLine(text.slice(l + 1, end))) {
      end = back(l);
      continue;
    }
    return end;
  }
}

/**
 * http(s) links with their character offsets.
 *
 * Trailing sentence punctuation is not part of the link, and neither is a
 * closing parenthesis without a matching opening one - both occur in the
 * corpus: "(https://developer.apple.com/…/219)" and "…/a/24u).".
 */
export function findLinks(text) {
  const links = [];
  for (const m of text.matchAll(/https?:\/\/[^\s<>]+/g)) {
    let uri = m[0];
    for (;;) {
      if (/[.,;:!?"']$/.test(uri)) uri = uri.slice(0, -1);
      else if (uri.endsWith(")") && count(uri, "(") < count(uri, ")")) uri = uri.slice(0, -1);
      else break;
    }
    links.push({ start: m.index, end: m.index + uri.length, uri });
  }
  return links;
}

const count = (s, ch) => s.split(ch).length - 1;

/**
 * #hashtags with their character offsets. The span includes the "#".
 *
 * Follows Bluesky's own rules closely enough for this corpus: a tag starts at
 * the beginning or after whitespace, runs to the next whitespace, loses
 * trailing punctuation ("#11ty," -> 11ty) and is not digits only.
 *
 * The blog template starts with the keycap emoji "#️⃣" - a "#" followed by
 * U+FE0F - which must not become a tag.
 */
export function findTags(text) {
  const tags = [];
  for (const m of text.matchAll(/(^|\s)#([^\s#]+)/gu)) {
    const tag = m[2].replace(/\p{P}+$/u, "");
    if (!tag || /^[️⃣]/.test(tag) || /^\d+$/.test(tag)) continue;
    if (graphemes(tag) > MAX_TAG_GRAPHEMES) continue;
    const start = m.index + m[1].length;
    tags.push({ start, end: start + 1 + tag.length, tag });
  }
  return tags;
}

/**
 * @handle.domain mentions with their character offsets. The span includes "@".
 *
 * A Bluesky handle always contains a dot, so the short names the replacement
 * table leaves alone when no account was found ("@Ivory", "@halide") are not
 * mentions. A Mastodon address ("@a@mastodon.social") is not either: its second
 * "@" is not preceded by whitespace, and the first part has no dot.
 */
export function findMentions(text) {
  const out = [];
  for (const m of text.matchAll(/(^|[\s(])@([a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9])(?![@\w])/g)) {
    const handle = m[2];
    if (!/\.[a-zA-Z][a-zA-Z0-9-]*$/.test(handle)) continue;
    const start = m.index + m[1].length;
    out.push({ start, end: start + 1 + handle.length, handle });
  }
  return out;
}

/**
 * Bluesky richtext facets for links, hashtags and mentions, sorted by position.
 *
 * Offsets are UTF-8 BYTES, not string indices - the corpus is full of emoji, so
 * a JavaScript index would be off by several bytes per emoji before the facet.
 *
 * A mention needs the account's DID, which takes a network lookup. `dids` maps
 * lowercased handle -> DID; the target fills it. A handle without a DID gets
 * no facet and posts as plain text.
 */
export function facets(text, dids = {}) {
  const span = (start, end) => {
    const byteStart = byteLength(text.slice(0, start));
    return { byteStart, byteEnd: byteStart + byteLength(text.slice(start, end)) };
  };
  const out = [
    ...findLinks(text).map((l) => ({
      index: span(l.start, l.end),
      features: [{ $type: "app.bsky.richtext.facet#link", uri: l.uri }],
    })),
    ...findTags(text).map((t) => ({
      index: span(t.start, t.end),
      features: [{ $type: "app.bsky.richtext.facet#tag", tag: t.tag }],
    })),
    ...findMentions(text)
      .filter((m) => dids[m.handle.toLowerCase()])
      .map((m) => ({
        index: span(m.start, m.end),
        features: [{ $type: "app.bsky.richtext.facet#mention", did: dids[m.handle.toLowerCase()] }],
      })),
  ];
  return out.sort((a, b) => a.index.byteStart - b.index.byteStart);
}

/**
 * Full Bluesky text step for one rendered item.
 * Returns { text, facets, shortened }.
 */
export function blueskyPost(text, item, { max = MAX_GRAPHEMES } = {}) {
  const short = shorten(text, item.url, { max });
  if (byteLength(short.text) > MAX_BYTES) {
    throw new Error(`${item.id ?? item.url}: ${byteLength(short.text)} bytes, over Bluesky's ${MAX_BYTES}`);
  }
  return { ...short, facets: facets(short.text) };
}
