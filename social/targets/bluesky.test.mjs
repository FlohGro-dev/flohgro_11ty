// node --test social/targets/bluesky.test.mjs
// Every test uses a fake fetch. Nothing here touches the network.
import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, mkdtempSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import createBluesky, { webpSize } from "./bluesky.mjs";

const cfg = {
  service: "https://bsky.social",
  identifier: "flohgro.bsky.social",
  tokenEnv: "BLUESKY_APP_PASSWORD",
  language: "en",
  maxImages: 4,
};
const env = { BLUESKY_APP_PASSWORD: "app-pass" };
const DID = "did:plc:txnv4g6dzifihqhd5gi7etvv";

const json = (body, status = 200, headers = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers(headers),
  json: async () => body,
  text: async () => JSON.stringify(body),
});

const SESSION = json({ accessJwt: "jwt", did: DID, handle: "flohgro.bsky.social" });
const CREATED = json({ uri: `at://${DID}/app.bsky.feed.post/3abc`, cid: "bafy" });

/** Records calls and replays scripted responses, keyed by "METHOD nsid". */
function fakeFetch(script) {
  const calls = [];
  const fn = async (url, opts = {}) => {
    const u = new URL(url);
    calls.push({ url, ...opts, json: typeof opts.body === "string" ? JSON.parse(opts.body) : undefined });
    const key = `${opts.method ?? "GET"} ${u.pathname.replace("/xrpc/", "")}`;
    const next = typeof script[key] === "function" ? script[key](u) : script[key];
    if (!next) throw new Error(`unexpected call ${key}`);
    return Array.isArray(next) ? next.shift() : next;
  };
  fn.calls = calls;
  fn.find = (nsid) => calls.filter((c) => String(c.url).includes(nsid));
  return fn;
}

/** A minimal lossy WebP header: RIFF/WEBP/"VP8 " with the given size. */
function webp(width, height) {
  const b = Buffer.alloc(40);
  b.write("RIFF", 0);
  b.write("WEBP", 8);
  b.write("VP8 ", 12);
  b.set([0x9d, 0x01, 0x2a], 23);
  b.writeUInt16LE(width, 26);
  b.writeUInt16LE(height, 28);
  return b;
}

function tmpDir(files) {
  const dir = mkdtempSync(path.join(tmpdir(), "bsky-"));
  for (const [name, bytes] of Object.entries(files)) writeFileSync(path.join(dir, name), bytes);
  return dir;
}

const blogItem = {
  id: "https://flohgro.com/blog/x/",
  url: "https://flohgro.com/blog/x/",
  type: "blog",
  title: "X",
  text: "",
};

// --- webpSize --------------------------------------------------------------

test("webpSize reads lossy, lossless and extended headers", () => {
  assert.deepEqual(webpSize(webp(1760, 990)), { width: 1760, height: 990 });

  const vp8l = Buffer.alloc(30);
  vp8l.write("RIFF", 0);
  vp8l.write("WEBP", 8);
  vp8l.write("VP8L", 12);
  vp8l[20] = 0x2f;
  vp8l.writeUInt32LE((800 - 1) | ((600 - 1) << 14), 21);
  assert.deepEqual(webpSize(vp8l), { width: 800, height: 600 });

  const vp8x = Buffer.alloc(30);
  vp8x.write("RIFF", 0);
  vp8x.write("WEBP", 8);
  vp8x.write("VP8X", 12);
  vp8x.writeUIntLE(1320 - 1, 24, 3);
  vp8x.writeUIntLE(2000 - 1, 27, 3);
  assert.deepEqual(webpSize(vp8x), { width: 1320, height: 2000 });
});

test("webpSize returns null for anything else", () => {
  assert.equal(webpSize(Buffer.from([0x89, 0x50, 0x4e, 0x47])), null);
});

test("webpSize matches the real eleventy-img output", { skip: !existsSync("_site/img") && "no _site build" }, () => {
  // Files are named <hash>-<width>.webp.
  const files = readdirSync("_site/img").filter((f) => f.endsWith(".webp")).slice(0, 20);
  for (const f of files) {
    const size = webpSize(readFileSync(path.join("_site/img", f)));
    assert.equal(size.width, Number(f.match(/-(\d+)\.webp$/)[1]), f);
    assert.ok(size.height > 0, f);
  }
});

// --- session ---------------------------------------------------------------

test("logs in once with the handle and app password, then reuses the session", async () => {
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.createRecord": [CREATED, CREATED],
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await b.post({ text: "one", images: [], item: { id: "a", url: "https://flohgro.com/post/a/" } });
  await b.post({ text: "two", images: [], item: { id: "b", url: "https://flohgro.com/post/b/" } });

  const logins = f.find("createSession");
  assert.equal(logins.length, 1);
  assert.deepEqual(logins[0].json, { identifier: "flohgro.bsky.social", password: "app-pass" });
  assert.equal(f.find("createRecord")[0].headers.Authorization, "Bearer jwt");
});

test("a missing app password is an error, not a silent no-op", async () => {
  const b = createBluesky(cfg, { env: {}, fetch: fakeFetch({}) });
  await assert.rejects(b.post({ text: "hi", images: [], item: { id: "i", url: "u" } }), /BLUESKY_APP_PASSWORD is not set/);
});

// --- the post record -------------------------------------------------------

test("post creates an app.bsky.feed.post with text, language and facets", async () => {
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.createRecord": CREATED,
  });
  const b = createBluesky(cfg, { env, fetch: f, now: () => new Date("2026-10-19T12:00:00Z") });
  const out = await b.post({ text: "hello #IndieDev", images: [], item: { id: "a", url: "https://flohgro.com/post/a/" } });

  assert.deepEqual(out, {
    id: `at://${DID}/app.bsky.feed.post/3abc`,
    url: "https://bsky.app/profile/flohgro.bsky.social/post/3abc",
  });
  const { repo, collection, record } = f.find("createRecord")[0].json;
  assert.equal(repo, DID);
  assert.equal(collection, "app.bsky.feed.post");
  assert.equal(record.$type, "app.bsky.feed.post");
  assert.equal(record.text, "hello #IndieDev");
  assert.deepEqual(record.langs, ["en"]);
  assert.equal(record.createdAt, "2026-10-19T12:00:00.000Z");
  assert.equal(record.facets[0].features[0].tag, "IndieDev");
  assert.equal(record.embed, undefined, "no images and no link -> no embed");
});

test("post shortens long text before sending", async () => {
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.createRecord": CREATED,
  });
  const b = createBluesky(cfg, { env, fetch: f });
  const long = Array.from({ length: 80 }, (_, i) => `word${i}`).join(" ");
  await b.post({ text: long, images: [], item: { id: "a", url: "https://flohgro.com/post/a/" } });
  const { record } = f.find("createRecord")[0].json;
  assert.ok(record.text.endsWith("…\n\n🔗 https://flohgro.com/post/a/"));
});

// --- mentions --------------------------------------------------------------

test("mentions are resolved to DIDs; unknown handles stay plain text", async () => {
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "GET com.atproto.identity.resolveHandle": (u) =>
      u.searchParams.get("handle") === "raycast.com"
        ? json({ did: "did:plc:raycast" })
        : json({ error: "InvalidRequest", message: "Unable to resolve handle" }, 400),
    "POST com.atproto.repo.createRecord": CREATED,
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await b.post({
    text: "video about @raycast.com and @gone.example.com, also @Ivory",
    images: [],
    item: { id: "a", url: "https://flohgro.com/post/a/" },
  });
  const { record } = f.find("createRecord")[0].json;
  const mentions = record.facets.filter((x) => x.features[0].$type === "app.bsky.richtext.facet#mention");
  assert.deepEqual(mentions.map((m) => m.features[0].did), ["did:plc:raycast"]);
  assert.equal(
    Buffer.from(record.text).subarray(mentions[0].index.byteStart, mentions[0].index.byteEnd).toString(),
    "@raycast.com",
  );
  // @Ivory has no dot - not a handle, never looked up.
  assert.ok(!f.find("resolveHandle").some((c) => String(c.url).includes("Ivory")));
});

// --- embeds (decision B3) --------------------------------------------------

test("images are uploaded as blobs with alt text and aspect ratio", async () => {
  const dir = tmpDir({ "a.webp": webp(1760, 990) });
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.uploadBlob": json({ blob: { $type: "blob", ref: { $link: "bafyimg" }, mimeType: "image/webp", size: 40 } }),
    "POST com.atproto.repo.createRecord": CREATED,
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await b.post({
    text: `#️⃣ X \n\nhi\n\n🔗 ${blogItem.url}`,
    images: [{ src: "orig.jpeg", upload: "a.webp", alt: "a waterfall" }],
    item: blogItem,
    rootDir: dir,
  });

  const upload = f.find("uploadBlob")[0];
  assert.equal(upload.headers["Content-Type"], "image/webp");
  assert.equal(upload.body.byteLength, 40);
  const { embed } = f.find("createRecord")[0].json.record;
  assert.equal(embed.$type, "app.bsky.embed.images");
  assert.deepEqual(embed.images, [
    { alt: "a waterfall", image: { $type: "blob", ref: { $link: "bafyimg" }, mimeType: "image/webp", size: 40 }, aspectRatio: { width: 1760, height: 990 } },
  ]);
});

test("images win over a link card", async () => {
  const dir = tmpDir({ "a.webp": webp(10, 10) });
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.uploadBlob": json({ blob: { ref: "x" } }),
    "POST com.atproto.repo.createRecord": CREATED,
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await b.post({ text: `hi\n\n🔗 ${blogItem.url}`, images: [{ upload: "a.webp", alt: "x" }], item: blogItem, rootDir: dir });
  assert.equal(f.find("createRecord")[0].json.record.embed.$type, "app.bsky.embed.images");
});

test("no images and the post links to flohgro.com -> link card for that page", async () => {
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.createRecord": CREATED,
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await b.post({ text: `#️⃣ X \n\nsome text\n\n🔗 ${blogItem.url}`, images: [], item: blogItem });
  assert.deepEqual(f.find("createRecord")[0].json.record.embed, {
    $type: "app.bsky.embed.external",
    external: { uri: blogItem.url, title: "X", description: "" },
  });
});

test("images beyond the limit are dropped; an oversized image fails before upload", async () => {
  const big = Buffer.concat([webp(10, 10), Buffer.alloc(2_000_001)]);
  const dir = tmpDir({ "a.webp": webp(10, 10), "big.webp": big });
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.uploadBlob": () => json({ blob: { ref: "x" } }),
    "POST com.atproto.repo.createRecord": CREATED,
  });
  const b = createBluesky(cfg, { env, fetch: f });
  const five = Array.from({ length: 5 }, () => ({ upload: "a.webp", alt: "x" }));
  await b.post({ text: "hi", images: five, item: { id: "a", url: "u" }, rootDir: dir });
  assert.equal(f.find("uploadBlob").length, 4);

  await assert.rejects(
    b.post({ text: "hi", images: [{ upload: "big.webp", alt: "x" }], item: { id: "b", url: "u" }, rootDir: dir }),
    /over Bluesky's limit of 2000000/,
  );
});

test("uploading an image does not create a post", async () => {
  const dir = tmpDir({ "a.webp": webp(10, 10) });
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.uploadBlob": json({ blob: { ref: "x" } }),
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await b.uploadImage({ upload: "a.webp", alt: "x" }, { rootDir: dir });
  assert.equal(f.find("createRecord").length, 0, "must not post");
});

// --- errors ----------------------------------------------------------------

test("a 429 is retried once after the rate-limit reset", async () => {
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.createRecord": [json({ error: "RateLimitExceeded" }, 429, { "retry-after": "0" }), CREATED],
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await b.post({ text: "hi", images: [], item: { id: "a", url: "u" } });
  assert.equal(f.find("createRecord").length, 2);
});

test("an API error surfaces with its status and body", async () => {
  const f = fakeFetch({
    "POST com.atproto.server.createSession": SESSION,
    "POST com.atproto.repo.createRecord": json({ error: "InvalidRequest", message: "bad record" }, 400),
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await assert.rejects(b.post({ text: "hi", images: [], item: { id: "a", url: "u" } }), /400.*bad record/s);
});

test("a wrong app password fails at login with a clear message", async () => {
  const f = fakeFetch({
    "POST com.atproto.server.createSession": json({ error: "AuthenticationRequired", message: "Invalid identifier or password" }, 401),
  });
  const b = createBluesky(cfg, { env, fetch: f });
  await assert.rejects(b.post({ text: "hi", images: [], item: { id: "a", url: "u" } }), /createSession.*401.*Invalid identifier or password/s);
});
