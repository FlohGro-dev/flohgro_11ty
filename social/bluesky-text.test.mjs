// node --test social/bluesky-text.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

import { graphemes, findLinks, findTags, findMentions, facets, shorten, blueskyPost } from "./bluesky-text.mjs";
import { renderItem, applyReplacements } from "./render.mjs";

const POST_URL = "https://flohgro.com/post/2026-10-19-12-00-00/";
const words = (n) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");

/** Decode a facet's byte range back to the string it covers. */
const sliceBytes = (text, { byteStart, byteEnd }) =>
  Buffer.from(text, "utf8").subarray(byteStart, byteEnd).toString("utf8");

// --- graphemes -------------------------------------------------------------

test("graphemes: an emoji, a flag and a keycap each count as one", () => {
  assert.equal(graphemes("abc"), 3);
  assert.equal(graphemes("🫶"), 1);
  assert.equal(graphemes("👨‍👩‍👧"), 1);
  assert.equal(graphemes("🇮🇹"), 1);
  assert.equal(graphemes("#️⃣"), 1);
});

// --- shorten ---------------------------------------------------------------

test("shorten: text that fits is returned unchanged", () => {
  const text = "A short post #IndieDev";
  assert.deepEqual(shorten(text, POST_URL), { text, shortened: false });
});

test("shorten: exactly 300 graphemes fits, 301 does not", () => {
  // Emoji, so a byte or UTF-16 count would get this wrong.
  assert.equal(shorten("🫶".repeat(300), POST_URL).shortened, false);
  assert.throws(() => shorten("🫶".repeat(301), POST_URL), /no space to cut at/);
});

test("shorten: long post is cut at a word, gets … and the link to the post", () => {
  const { text, shortened } = shorten(words(80), POST_URL);
  assert.equal(shortened, true);
  assert.ok(graphemes(text) <= 300, `${graphemes(text)} graphemes`);
  assert.ok(text.endsWith(`…\n\n🔗 ${POST_URL}`), text);
  // Whatever is kept before the … is whole words from the original.
  const kept = text.slice(0, text.indexOf("…"));
  assert.ok(words(80).startsWith(kept + " "), `cut mid-word: ${kept.slice(-20)}`);
});

test("shorten: uses the budget - no more than one word is lost to the cut", () => {
  const { text } = shorten(words(80), POST_URL);
  // The next word would not have fitted.
  const kept = text.slice(0, text.indexOf("…"));
  const nextWord = words(80).slice(kept.length + 1).split(" ")[0];
  assert.ok(graphemes(text) + nextWord.length + 1 > 300);
});

test("shorten: a blog post keeps its own 🔗 line and title, no second URL", () => {
  const blogUrl = "https://flohgro.com/blog/some-post/";
  const input = `#️⃣ Some Post \n\n${words(80)}\n\n🔗 ${blogUrl}`;
  const { text, shortened } = shorten(input, blogUrl);
  assert.equal(shortened, true);
  assert.ok(text.startsWith("#️⃣ Some Post \n\n"), text);
  assert.ok(text.endsWith(`…\n\n🔗 ${blogUrl}`), text);
  assert.equal(text.split(blogUrl).length - 1, 1, "URL appears exactly once");
  assert.ok(graphemes(text) <= 300);
});

test("shorten: a URL that straddles the cut is dropped whole, never cut", () => {
  const link = "https://example.com/" + "a".repeat(60);
  const input = `${words(38)} ${link} ${words(20)}`;
  const { text } = shorten(input, POST_URL);
  assert.ok(!text.includes("https://example.com/"), "partial or whole link survived the cut");
  assert.ok(text.includes(`…\n\n🔗 ${POST_URL}`));
});

test("shorten: trailing punctuation before … is dropped", () => {
  const input = `${words(30)}, ${words(60)}`;
  const { text } = shorten(input, POST_URL, { max: graphemes(words(30)) + 4 + graphemes(`…\n\n🔗 ${POST_URL}`) });
  assert.ok(text.startsWith(words(30) + "…"), text.slice(0, 40));
});

test("shorten: a last line left with no letters or digits is dropped", () => {
  // Corpus: "📲 https://apps.apple.com/…" - the cut drops the link, which must
  // not leave a lone "📲…" behind.
  const input = `${words(30)}\n\n📲 https://apps.apple.com/us/app/${"x".repeat(200)}\n\nmore`;
  const { text } = shorten(input, POST_URL);
  assert.ok(text.startsWith(words(30) + "…\n\n🔗 "), JSON.stringify(text.slice(-80)));
});

test("shorten: a quote keeps its author and #RandomQuote, only the quote is cut", () => {
  const url = "https://flohgro.com/quote/20250121140704/";
  const input = `${words(80)} #happiness\n\n-- Slime Mold Time Mold\n\n#RandomQuote`;
  const { text } = shorten(input, url);
  assert.ok(graphemes(text) <= 300);
  assert.ok(text.endsWith(`…\n\n-- Slime Mold Time Mold\n\n#RandomQuote\n\n🔗 ${url}`), JSON.stringify(text.slice(-90)));
  assert.ok(text.startsWith("word0 word1"));
});

test("shorten: an author line directly under the quote is kept too", () => {
  // 3 corpus quotes have no blank line before "-- Author".
  const input = `${words(80)}\n-- Seneca\n\n#RandomQuote`;
  const { text } = shorten(input, POST_URL);
  assert.ok(text.endsWith(`…\n-- Seneca\n\n#RandomQuote\n\n🔗 ${POST_URL}`), JSON.stringify(text.slice(-70)));
});

test("shorten: a final paragraph of only hashtags is kept", () => {
  const input = `${words(80)}\n\nA boost would mean a lot!\n\n#IndieApp #iOS #Photography`;
  const { text } = shorten(input, POST_URL);
  assert.ok(text.endsWith(`…\n\n#IndieApp #iOS #Photography\n\n🔗 ${POST_URL}`), JSON.stringify(text.slice(-80)));
});

test("shorten: '--' or hashtags in the middle of the text are not protected", () => {
  const input = `#Intro line\n\n-- not an author\n\n${words(80)}`;
  const { text } = shorten(input, POST_URL);
  assert.ok(text.endsWith(`…\n\n🔗 ${POST_URL}`));
  assert.ok(text.startsWith("#Intro line\n\n-- not an author\n\nword0"));
});

test("shorten: a single token longer than the budget is an error, not a broken post", () => {
  assert.throws(() => shorten("x".repeat(400), POST_URL), /no space to cut at/);
});

// --- links -----------------------------------------------------------------

test("findLinks: trailing sentence punctuation is not part of the link", () => {
  // Both shapes occur in the corpus.
  assert.deepEqual(
    findLinks("see https://directory.getdrafts.com/a/24u).").map((l) => l.uri),
    ["https://directory.getdrafts.com/a/24u"],
  );
  assert.deepEqual(
    findLinks('session (https://developer.apple.com/videos/play/wwdc2025/219)').map((l) => l.uri),
    ["https://developer.apple.com/videos/play/wwdc2025/219"],
  );
  assert.deepEqual(findLinks("a https://flohgro.com/. b").map((l) => l.uri), ["https://flohgro.com/"]);
});

test("findLinks: balanced parentheses and inner commas stay in the link", () => {
  assert.deepEqual(
    findLinks("https://en.wikipedia.org/wiki/Foo_(bar)").map((l) => l.uri),
    ["https://en.wikipedia.org/wiki/Foo_(bar)"],
  );
  const blog = "https://flohgro.com/blog/releasing-on-this-day-1.4-%E2%80%94-live-photos,-ambient/";
  assert.deepEqual(findLinks(`🔗 ${blog}`).map((l) => l.uri), [blog]);
});

// --- tags ------------------------------------------------------------------

test("findTags: real hashtags from the corpus", () => {
  const tags = (t) => findTags(t).map((x) => x.tag);
  assert.deepEqual(tags("#RandomQuote"), ["RandomQuote"]);
  assert.deepEqual(tags("love #11ty, really"), ["11ty"]);
  assert.deepEqual(tags("#goal-setting matters"), ["goal-setting"]);
  assert.deepEqual(tags("with #Halide."), ["Halide"]);
  assert.deepEqual(tags("#Craft: CraftWork"), ["Craft"]);
});

test("findTags: not a hashtag", () => {
  assert.deepEqual(findTags("#️⃣ Blog title"), [], "the blog template's keycap emoji");
  assert.deepEqual(findTags("issue #123"), [], "digits only");
  assert.deepEqual(findTags("foo#bar"), [], "no space before #");
  assert.deepEqual(findTags("https://x.com/#anchor"), [], "fragment inside a URL");
});

// --- mentions --------------------------------------------------------------

test("findMentions: Bluesky handles, not short names or Mastodon addresses", () => {
  const handles = (t) => findMentions(t).map((m) => m.handle);
  assert.deepEqual(handles("by @chrislawley.me, about @raycast.com."), ["chrislawley.me", "raycast.com"]);
  assert.deepEqual(handles("(@draftsapp.bsky.social)"), ["draftsapp.bsky.social"]);
  assert.deepEqual(handles("@Ivory and @halide"), [], "no dot - not a handle");
  assert.deepEqual(handles("@ChrisLawley@mastodon.social"), [], "Mastodon address");
  assert.deepEqual(handles("mail foo@raycast.com"), [], "email address");
});

test("facets: a mention gets a facet only when its DID is known", () => {
  const text = "🫶 @raycast.com and @unknown.example.com";
  const f = facets(text, { "raycast.com": "did:plc:raycast" });
  assert.equal(f.length, 1);
  assert.equal(sliceBytes(text, f[0].index), "@raycast.com");
  assert.deepEqual(f[0].features, [{ $type: "app.bsky.richtext.facet#mention", did: "did:plc:raycast" }]);
});

// --- facets ----------------------------------------------------------------

test("facets: byte offsets are UTF-8, not string indices", () => {
  const text = "🫶 #Mastodon über https://flohgro.com/";
  const f = facets(text);
  assert.equal(f.length, 2);
  const [tag, link] = f;
  assert.deepEqual(tag.index, { byteStart: 5, byteEnd: 14 });
  assert.equal(sliceBytes(text, tag.index), "#Mastodon");
  assert.deepEqual(tag.features, [{ $type: "app.bsky.richtext.facet#tag", tag: "Mastodon" }]);
  assert.equal(sliceBytes(text, link.index), "https://flohgro.com/");
  assert.deepEqual(link.features, [{ $type: "app.bsky.richtext.facet#link", uri: "https://flohgro.com/" }]);
});

test("facets: sorted by position", () => {
  const f = facets("https://a.com/ #one https://b.com/ #two");
  const starts = f.map((x) => x.index.byteStart);
  assert.deepEqual(starts, [...starts].sort((a, b) => a - b));
  assert.equal(f.length, 4);
});

// --- blueskyPost -----------------------------------------------------------

test("blueskyPost: facets are computed on the shortened text", () => {
  const post = blueskyPost(`${words(80)} #Late`, { url: POST_URL });
  assert.equal(post.shortened, true);
  assert.ok(!post.text.includes("#Late"));
  assert.deepEqual(
    post.facets.map((f) => sliceBytes(post.text, f.index)),
    [POST_URL],
  );
});

// --- bluesky replacements (config.json) ------------------------------------

const realConfig = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));
const bsky = (t) => applyReplacements(t, realConfig.replacements, "bluesky");

test("bluesky replacements: hand-written Mastodon addresses become Bluesky handles", () => {
  // FlohGro's example, 2026-10-19.
  assert.equal(
    bsky("@ChrisLawley@mastodon.social made a fantastic video about @raycast@mastodon.social, highlighting my extension for @drafts@indieapps.space. Thanks"),
    "@chrislawley.me made a fantastic video about @raycast.com, highlighting my extension for @draftsapp.bsky.social. Thanks",
  );
});

test("bluesky replacements: short and full forms both work, neither expands twice", () => {
  assert.equal(bsky("built with @Drafts"), "built with @draftsapp.bsky.social");
  assert.equal(bsky("thanks @11ty and @eleventy@fosstodon.org"), "thanks @11ty.dev and @11ty.dev");
  assert.equal(bsky("@Raycast"), "@raycast.com");
});

test("bluesky replacements: no account found -> the short name, never a guess", () => {
  assert.equal(bsky("using @ivory@tapbots.social"), "using @Ivory");
  assert.equal(bsky("shot with @halide"), "shot with @halide");
});

const masto = (t) => applyReplacements(t, realConfig.replacements, "mastodon");

test("bluesky-only rows (hand-written Mastodon addresses) do not touch Mastodon", () => {
  assert.equal(masto("@relay@relayfm.social and @raycast@mastodon.social"), "@relay@relayfm.social and @raycast@mastodon.social");
});

test("short forms work on both platforms (FlohGro, 2026-10-19)", () => {
  assert.equal(masto("@Raycast"), "@raycast@mastodon.social");
  assert.equal(bsky("@Raycast"), "@raycast.com");
  assert.equal(masto("@Ivory"), "@ivory@tapbots.social");
  assert.equal(bsky("@Ivory"), "@Ivory");
  // No official Craft account on Mastodon - the search text stays.
  assert.equal(masto("@CraftDocs"), "@CraftDocs");
  assert.equal(masto("for @craftdocs!"), "for @craftdocs!", "left exactly as typed");
});

// --- the real content ------------------------------------------------------

const QUEUE = new URL("../_site/social-queue.json", import.meta.url);

test("corpus: every queue item becomes a valid Bluesky post", { skip: !existsSync(QUEUE) && "no _site build" }, () => {
  const config = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));
  const queue = JSON.parse(readFileSync(QUEUE, "utf8"));
  let shortenedCount = 0;
  for (const item of queue) {
    const { text: rendered } = renderItem(item, config, "bluesky");
    const post = blueskyPost(rendered, item);
    if (post.shortened) shortenedCount++;
    assert.ok(graphemes(post.text) <= 300, `${item.id}: ${graphemes(post.text)} graphemes`);
    assert.ok(Buffer.byteLength(post.text) <= 3000, `${item.id}: over 3000 bytes`);
    if (post.shortened) assert.ok(post.text.includes(item.url), `${item.id}: shortened without its link`);
    for (const f of post.facets) {
      const covered = sliceBytes(post.text, f.index);
      const feat = f.features[0];
      if (feat.uri) assert.equal(covered, feat.uri, item.id);
      else assert.equal(covered, `#${feat.tag}`, item.id);
    }
  }
  // 20 at the time of writing; a sanity bound, not an exact count.
  assert.ok(shortenedCount > 0 && shortenedCount < queue.length / 4, `${shortenedCount} shortened`);
});

test("bluesky files import nothing outside node: builtins", () => {
  for (const f of ["bluesky-text.mjs", "bluesky-preview.mjs", "targets/bluesky.mjs"]) {
    const file = new URL(f, import.meta.url);
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/^import\s+(?:.+?\s+from\s+)?["']([^"']+)["']/gm)) {
      assert.ok(
        /^(node:|\.\.?\/)/.test(m[1]),
        `${f} imports "${m[1]}" - social/ must stay dependency-free, CI has no npm install`,
      );
    }
  }
});
