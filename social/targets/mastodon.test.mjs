// node --test social/targets/mastodon.test.mjs
// Every test uses a fake fetch. Nothing here touches the network.
import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import createMastodon, { mimeFor, limitsFrom } from "./mastodon.mjs";

const cfg = {
  instance: "https://social.lol",
  tokenEnv: "MASTODON_TOKEN",
  visibility: "public",
  language: "en",
  maxImages: 4,
};
const env = { MASTODON_TOKEN: "tok" };

const json = (body, status = 200, headers = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers(headers),
  json: async () => body,
  text: async () => JSON.stringify(body),
});

/** Records calls and replays scripted responses. */
function fakeFetch(script) {
  const calls = [];
  const fn = async (url, opts = {}) => {
    calls.push({ url, ...opts });
    const key = `${opts.method ?? "GET"} ${new URL(url).pathname}`;
    const next = script[key];
    if (!next) throw new Error(`unexpected call ${key}`);
    return Array.isArray(next) ? next.shift() : next;
  };
  fn.calls = calls;
  return fn;
}

function tmpImage(name = "a.png") {
  const dir = mkdtempSync(path.join(tmpdir(), "mast-"));
  writeFileSync(path.join(dir, name), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  return dir;
}

test("mimeFor maps known extensions and rejects unknown ones", () => {
  assert.equal(mimeFor("/x/a.PNG"), "image/png");
  assert.equal(mimeFor("/x/a.jpeg"), "image/jpeg");
  assert.throws(() => mimeFor("/x/a.txt"), /Unsupported image type/);
});

test("limitsFrom reads the instance configuration", () => {
  assert.deepEqual(
    limitsFrom({
      configuration: {
        statuses: { max_characters: 9001, max_media_attachments: 8 },
        media_attachments: { image_size_limit: 16_000_000 },
      },
    }),
    { maxChars: 9001, maxImages: 8, maxImageBytes: 16_000_000 },
  );
});

test("limitsFrom falls back when the instance says nothing", () => {
  assert.deepEqual(limitsFrom({}), { maxChars: 500, maxImages: 4, maxImageBytes: null });
});

test("init reads the real character limit from the instance", async () => {
  const f = fakeFetch({
    "GET /api/v2/instance": json({ configuration: { statuses: { max_characters: 9001 } } }),
  });
  const m = createMastodon(cfg, { env, fetch: f });
  const limits = await m.init();
  assert.equal(limits.maxChars, 9001);
  // config maxImages caps whatever the instance allows
  assert.equal(limits.maxImages, 4);
});

test("init falls back to the v1 endpoint", async () => {
  const f = fakeFetch({
    "GET /api/v2/instance": json({ error: "nope" }, 404),
    "GET /api/v1/instance": json({ configuration: { statuses: { max_characters: 500 } } }),
  });
  const m = createMastodon(cfg, { env, fetch: f });
  assert.equal((await m.init()).maxChars, 500);
});

test("post sends the text, visibility, language and the Idempotency-Key", async () => {
  const f = fakeFetch({
    "POST /api/v1/statuses": json({ id: "1", url: "https://social.lol/@flohgro/1" }),
  });
  const m = createMastodon(cfg, { env, fetch: f });
  const out = await m.post({ text: "hello", images: [], item: { id: "https://flohgro.com/post/1/" } });

  assert.deepEqual(out, { id: "1", url: "https://social.lol/@flohgro/1" });
  const call = f.calls[0];
  assert.equal(call.headers["Idempotency-Key"], "https://flohgro.com/post/1/");
  assert.equal(call.headers.Authorization, "Bearer tok");
  assert.equal(call.body.get("status"), "hello");
  assert.equal(call.body.get("visibility"), "public");
  assert.equal(call.body.get("language"), "en");
});

test("post refuses to send text over the instance limit", async () => {
  const f = fakeFetch({
    "GET /api/v2/instance": json({ configuration: { statuses: { max_characters: 10 } } }),
  });
  const m = createMastodon(cfg, { env, fetch: f });
  await m.init();
  await assert.rejects(
    m.post({ text: "x".repeat(11), images: [], item: { id: "i" } }),
    /over the instance limit of 10/,
  );
});

test("a missing token is an error, not a silent no-op", async () => {
  const m = createMastodon(cfg, { env: {}, fetch: fakeFetch({}) });
  await assert.rejects(m.post({ text: "hi", images: [], item: { id: "i" } }), /MASTODON_TOKEN is not set/);
});

test("upload attaches alt text and the media id", async () => {
  const dir = tmpImage();
  const f = fakeFetch({
    "POST /api/v2/media": json({ id: "m1" }, 200),
    "POST /api/v1/statuses": json({ id: "1", url: "u" }),
  });
  const m = createMastodon(cfg, { env, fetch: f });
  await m.post({
    text: "hi",
    images: [{ src: "a.png", alt: "a waterfall" }],
    item: { id: "i" },
    rootDir: dir,
  });

  const upload = f.calls[0];
  assert.equal(upload.body.get("description"), "a waterfall");
  assert.equal(f.calls[1].body.getAll("media_ids[]").length, 1);
  assert.equal(f.calls[1].body.getAll("media_ids[]")[0], "m1");
});

test("a 202 upload is polled until the attachment is ready", async () => {
  const dir = tmpImage();
  const f = fakeFetch({
    "POST /api/v2/media": json({ id: "m1" }, 202),
    // 206 means still processing; 200 means ready.
    "GET /api/v1/media/m1": [json({ id: "m1" }, 206), json({ id: "m1" }, 200)],
    "POST /api/v1/statuses": json({ id: "1", url: "u" }),
  });
  const m = createMastodon(cfg, { env, fetch: f });
  await m.post({ text: "hi", images: [{ src: "a.png", alt: "x" }], item: { id: "i" }, rootDir: dir });

  const polls = f.calls.filter((c) => String(c.url).includes("/api/v1/media/m1"));
  assert.equal(polls.length, 2, "should poll until 200");
  // The status must be posted only after processing finished.
  assert.ok(String(f.calls.at(-1).url).endsWith("/api/v1/statuses"));
});

test("a 429 is retried after Retry-After", async () => {
  const f = fakeFetch({
    "POST /api/v1/statuses": [
      json({ error: "slow down" }, 429, { "retry-after": "0" }),
      json({ id: "1", url: "u" }),
    ],
  });
  const m = createMastodon(cfg, { env, fetch: f });
  assert.deepEqual(await m.post({ text: "hi", images: [], item: { id: "i" } }), { id: "1", url: "u" });
  assert.equal(f.calls.length, 2);
});

test("an API error surfaces with its status and body", async () => {
  const f = fakeFetch({ "POST /api/v1/statuses": json({ error: "invalid" }, 422) });
  const m = createMastodon(cfg, { env, fetch: f });
  await assert.rejects(m.post({ text: "hi", images: [], item: { id: "i" } }), /422.*invalid/s);
});

test("images beyond the instance limit are dropped, not sent", async () => {
  const dir = tmpImage();
  const f = fakeFetch({
    "GET /api/v2/instance": json({
      configuration: { statuses: { max_characters: 9001, max_media_attachments: 2 } },
    }),
    "POST /api/v2/media": [json({ id: "m1" }), json({ id: "m2" })],
    "POST /api/v1/statuses": json({ id: "1", url: "u" }),
  });
  const m = createMastodon(cfg, { env, fetch: f });
  await m.init();
  await m.post({
    text: "hi",
    images: [1, 2, 3].map(() => ({ src: "a.png", alt: "x" })),
    item: { id: "i" },
    rootDir: dir,
  });
  assert.equal(f.calls.filter((c) => String(c.url).endsWith("/api/v2/media")).length, 2);
});

test("an oversized image is rejected before upload", async () => {
  const dir = tmpImage();
  const f = fakeFetch({
    "GET /api/v2/instance": json({
      configuration: { statuses: { max_characters: 9001 }, media_attachments: { image_size_limit: 2 } },
    }),
  });
  const m = createMastodon(cfg, { env, fetch: f });
  await m.init();
  await assert.rejects(
    m.post({ text: "hi", images: [{ src: "a.png", alt: "x" }], item: { id: "i" }, rootDir: dir }),
    /over the instance limit of 2/,
  );
});
