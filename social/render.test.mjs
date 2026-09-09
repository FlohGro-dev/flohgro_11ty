// node --test social/render.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { markdownToPlain, applyReplacements, renderTemplate, renderItem } from "./render.mjs";

const config = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));
const rows = config.replacements;
const sub = (t) => applyReplacements(t, rows, "mastodon");

test("replacement: basic case-insensitive substitution", () => {
  assert.equal(sub("built with @Drafts"), "built with @drafts@indieapps.space");
  assert.equal(sub("built with @drafts"), "built with @drafts@indieapps.space");
  assert.equal(sub("built with @DRAFTS"), "built with @drafts@indieapps.space");
});

test("replacement: single pass - a replacement containing its own find string does not expand", () => {
  // @11ty -> @11ty@neighborhood.11ty.dev, which contains "@11ty".
  assert.equal(sub("thanks @11ty"), "thanks @11ty@neighborhood.11ty.dev");
  // @Viticci -> @viticci@macstories.net, same shape.
  assert.equal(sub("via @Viticci"), "via @viticci@macstories.net");
});

test("replacement: already-expanded handles are left alone", () => {
  // 14 corpus items contain the full handle already, written out by hand.
  assert.equal(
    sub("shared to @drafts@indieapps.space today"),
    "shared to @drafts@indieapps.space today",
  );
  assert.equal(
    sub("@ChrisLawley@mastodon.social made a video"),
    "@ChrisLawley@mastodon.social made a video",
  );
  // And the real corpus line that mixes both.
  assert.equal(
    sub("thanks @drafts@indieapps.space. and @ChrisLawley@mastodon.social"),
    "thanks @drafts@indieapps.space. and @ChrisLawley@mastodon.social",
  );
});

test("replacement: word boundary after the match", () => {
  assert.equal(sub("@Crafty"), "@Crafty");
  assert.equal(sub("@Craft"), "#Craft");
  assert.equal(sub("@Craft."), "#Craft.");
  assert.equal(sub("@Craft, then"), "#Craft, then");
  assert.equal(sub("(@Craft)"), "(#Craft)");
});

test("replacement: not inside an email address or bare domain", () => {
  assert.equal(sub("mail me at foo@drafts.com"), "mail me at foo@drafts.com");
  assert.equal(sub("see @drafts.com"), "see @drafts.com");
});

test("replacement: never inside a URL", () => {
  assert.equal(
    sub("https://example.com/@Drafts/page and @Drafts"),
    "https://example.com/@Drafts/page and @drafts@indieapps.space",
  );
  assert.equal(
    sub("🔗 https://flohgro.com/blog/@Craft-review/"),
    "🔗 https://flohgro.com/blog/@Craft-review/",
  );
});

test("replacement: longest find wins", () => {
  // @MacStories must not be eaten by a shorter overlapping key.
  assert.equal(sub("@MacStories"), "@macstories@macstories.net");
  assert.equal(sub("@JohnVoorhees"), "@johnvoorhees@macstories.net");
});

test("replacement: multiple handles in one string, one pass", () => {
  assert.equal(
    sub("@Drafts and @Craft and @11ty"),
    "@drafts@indieapps.space and #Craft and @11ty@neighborhood.11ty.dev",
  );
});

test("markdownToPlain: links collapse to their label", () => {
  assert.equal(markdownToPlain("see [the post](https://example.com)"), "see the post");
});

test("markdownToPlain: strong emphasis is stripped", () => {
  assert.equal(
    markdownToPlain("People loose their **WAY** when they loose their **WHY**"),
    "People loose their WAY when they loose their WHY",
  );
});

test("markdownToPlain: blockquote markers are stripped", () => {
  assert.equal(markdownToPlain("> a line\n> -- DHL\n\nafter"), "a line\n-- DHL\n\nafter");
});

test("markdownToPlain: underscores in handles survive", () => {
  // Single-underscore emphasis is deliberately not stripped - it would corrupt
  // this, and the corpus contains no real single-underscore emphasis.
  assert.equal(markdownToPlain("Thanks @matt_birchler for the tip"), "Thanks @matt_birchler for the tip");
});

test("markdownToPlain: list markers are kept", () => {
  assert.equal(markdownToPlain("- new: a thing\n- fixed: another"), "- new: a thing\n- fixed: another");
});

test("template: blog keeps the trailing space after the title", () => {
  const out = renderTemplate(config.types.blog.template, {
    title: "A Title",
    text: "The social post.",
    url: "https://flohgro.com/blog/a-title/",
  });
  assert.equal(out, "#️⃣ A Title \n\nThe social post.\n\n🔗 https://flohgro.com/blog/a-title/");
});

test("template: no HTML escaping of apostrophes", () => {
  assert.equal(renderTemplate("{{ text }}", { text: "I'm sold & happy" }), "I'm sold & happy");
});

test("renderItem: quote gets the hashtag and no images", () => {
  const { text, images } = renderItem(
    {
      id: "x",
      type: "quote",
      title: null,
      text: "The essence of strategy is choosing what not to do\n\n-- Michael Porter",
      url: "https://flohgro.com/quote/1/",
      images: [{ alt: "a", src: "assets/a.png" }],
    },
    config,
    "mastodon",
  );
  assert.equal(
    text,
    "The essence of strategy is choosing what not to do\n\n-- Michael Porter\n\n#RandomQuote",
  );
  assert.deepEqual(images, []); // quote echo had Include Images OFF
});

test("renderItem: post passes images through, capped at 4", () => {
  const images = Array.from({ length: 6 }, (_, i) => ({ alt: `${i}`, src: `assets/${i}.png` }));
  const out = renderItem(
    { id: "x", type: "post", title: null, text: "hi @Craft", url: "u", images },
    config,
    "mastodon",
  );
  assert.equal(out.text, "hi #Craft");
  assert.equal(out.images.length, 4);
});

test("renderItem: blog replacements apply to _social_post (EchoFeed only did @Drafts)", () => {
  const out = renderItem(
    {
      id: "x",
      type: "blog",
      title: "Post",
      text: "Thanks @Viticci and @MacStories",
      url: "https://flohgro.com/blog/post/",
      images: [],
    },
    config,
    "mastodon",
  );
  assert.match(out.text, /@viticci@macstories\.net and @macstories@macstories\.net/);
  assert.match(out.text, /🔗 https:\/\/flohgro\.com\/blog\/post\/$/);
});

test("renderItem: unknown type is an error, not a silent skip", () => {
  assert.throws(() => renderItem({ id: "x", type: "nope", text: "" }, config, "mastodon"), /nope/);
});

test("template: a literal $ in the text is not treated as a replacement pattern", () => {
  assert.equal(renderTemplate("{{ text }}", { text: "costs $5 and $& too" }), "costs $5 and $& too");
});

test("template: an unknown variable is an error, not silent emptiness", () => {
  assert.throws(() => renderTemplate("{{ nope }}", { text: "x" }), /Unknown template variable/);
});

test("template: a Nunjucks tag is rejected rather than emitted raw", () => {
  assert.throws(() => renderTemplate("{% if x %}a{% endif %}", {}), /not supported/);
});

test("template: missing title or url render as empty, not 'undefined'", () => {
  assert.equal(renderTemplate("[{{ title }}][{{ url }}]", { text: "x" }), "[][]");
});

test("social/ imports nothing outside node: builtins", async () => {
  const { readFileSync } = await import("node:fs");
  const files = ["render.mjs", "syndicate.mjs", "targets/mastodon.mjs"];
  for (const f of files) {
    const src = readFileSync(new URL(f, import.meta.url), "utf8");
    for (const m of src.matchAll(/^import\s+(?:.+?\s+from\s+)?["']([^"']+)["']/gm)) {
      const spec = m[1];
      assert.ok(
        spec.startsWith("node:") || spec.startsWith("./") || spec.startsWith("../"),
        `${f} imports "${spec}" - social/ must stay dependency-free, CI has no npm install`,
      );
    }
  }
});
