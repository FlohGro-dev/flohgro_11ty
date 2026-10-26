// node --test social/bluesky-preview.test.mjs
import test from "node:test";
import assert from "node:assert/strict";

import { preview, previewMarkdown, parseArgs } from "./bluesky-preview.mjs";

const config = {
  types: {
    post: { template: "{{ text }}", images: true },
    quote: { template: "{{ text }}\n\n#RandomQuote", images: false },
  },
  targets: {},
  replacementsCaseInsensitive: true,
  replacements: [{ find: "@Drafts", replace: { mastodon: "@drafts@indieapps.space", bluesky: "@draftsapp.bsky.social" } }],
};
const long = Array.from({ length: 80 }, (_, i) => `word${i}`).join(" ");
const queue = [
  { id: "a", type: "post", url: "https://flohgro.com/post/a/", text: "hi @Drafts", images: [{ src: "x.png", alt: "x" }] },
  { id: "b", type: "post", url: "https://flohgro.com/post/b/", text: long, images: [] },
  { id: "c", type: "quote", url: "https://flohgro.com/quote/c/", text: "x".repeat(400), images: [] },
];

test("preview: applies the bluesky replacements, not the mastodon ones", () => {
  const [a] = preview(queue, config, { filter: "a" });
  assert.equal(a.text, "hi @draftsapp.bsky.social");
});

test("preview: images win, link card only without images (B3)", () => {
  const [a, b] = preview(queue, config, {});
  assert.equal(a.embed, "images");
  assert.equal(b.embed, "link card");
});

test("preview: a failing item is reported, the rest still render", () => {
  const items = preview(queue, config, {});
  assert.equal(items.length, 3);
  assert.equal(items[1].shortened, true);
  assert.match(items[2].error, /no space to cut at/);
});

test("preview: --shortened and --last narrow the list", () => {
  assert.deepEqual(preview(queue, config, { shortened: true }).map((i) => i.id), ["b", "c"]);
  assert.deepEqual(preview(queue, config, { last: 1 }).map((i) => i.id), ["c"]);
});

test("preview: never touches the network", () => {
  const real = globalThis.fetch;
  globalThis.fetch = () => assert.fail("preview called fetch");
  try {
    preview(queue, config, {});
  } finally {
    globalThis.fetch = real;
  }
});

test("previewMarkdown: shows text, facets and errors", () => {
  const md = previewMarkdown(preview(queue, config, {}));
  assert.match(md, /## a/);
  assert.match(md, /shortened/);
  assert.match(md, /\*\*ERROR\*\*/);
  assert.match(md, /🔗 https:\/\/flohgro\.com\/post\/b\//);
  assert.match(md, /mention: @draftsapp\.bsky\.social/);
});

test("parseArgs", () => {
  assert.deepEqual(parseArgs(["--last", "5", "--shortened", "--report", "p.md"]), {
    config: "social/config.json",
    filter: null,
    last: 5,
    shortened: true,
    report: "p.md",
    help: false,
  });
  assert.throws(() => parseArgs(["--live"]), /Unknown argument/);
});
