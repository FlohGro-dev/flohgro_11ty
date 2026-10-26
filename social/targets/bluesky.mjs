// Bluesky target. Node 20 globals only - fetch, Buffer. No deps: @atproto/api
// would need npm install, which the syndicate job does not run.
//
// Same factory shape as targets/mastodon.mjs - { name, post({ text, images,
// item, rootDir }) } - so syndicate.mjs drives it unchanged. The text arrives
// rendered by render.mjs; shortening and facets happen here, via
// bluesky-text.mjs, so the Mastodon path never sees them.
//
// See docs/echofeed-migration.md, "Bluesky".

import { readFile } from "node:fs/promises";
import path from "node:path";

import { mimeFor } from "./mastodon.mjs";
import { blueskyPost, facets, findMentions } from "../bluesky-text.mjs";

// app.bsky.embed.images lexicon: maxSize 2000000, at most 4 images.
const MAX_IMAGE_BYTES = 2_000_000;
const MAX_IMAGES = 4;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Width and height from a WebP header, or null for anything else.
 *
 * Bluesky lays a post out from `aspectRatio` before the image loads; without it
 * clients guess. The queue does not carry dimensions, but every `upload` file is
 * an eleventy-img WebP, and reading its header beats adding an image library.
 */
export function webpSize(buf) {
  if (buf.length < 30 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  switch (buf.toString("ascii", 12, 16)) {
    case "VP8 ": // lossy: 14-bit sizes after the 9d 01 2a start code
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    case "VP8L": {
      // lossless: 14 bits width-1, 14 bits height-1, after the 0x2f signature
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    case "VP8X": // extended: 24-bit width-1, height-1
      return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
    default:
      return null;
  }
}

export default function createBluesky(cfg, { env = process.env, fetch: f = globalThis.fetch, now = () => new Date() } = {}) {
  const base = String(cfg.service ?? "https://bsky.social").replace(/\/+$/, "");
  const password = env[cfg.tokenEnv];
  const maxImages = Math.min(cfg.maxImages ?? MAX_IMAGES, MAX_IMAGES);

  let session = null;

  async function call(nsid, { method = "GET", body, headers = {}, query, auth = true, retries = 1 } = {}) {
    const url = new URL(`${base}/xrpc/${nsid}`);
    for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
    const res = await f(url.href, {
      method,
      body,
      headers: {
        Accept: "application/json",
        ...(auth ? { Authorization: `Bearer ${(await login()).accessJwt}` } : {}),
        ...headers,
      },
    });

    // Retry-After in seconds, or the ratelimit-reset epoch Bluesky also sends.
    if (res.status === 429 && retries > 0) {
      const after = res.headers.get("retry-after");
      const reset = res.headers.get("ratelimit-reset");
      const wait = after != null ? Number(after) * 1000 : reset ? Number(reset) * 1000 - Date.now() : 5000;
      await sleep(Math.max(0, Math.min(wait, 60_000)));
      return call(nsid, { method, body, headers, query, auth, retries: retries - 1 });
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Bluesky ${method} ${nsid} failed: ${res.status} ${detail.slice(0, 300)}`);
    }
    return res;
  }

  /** One session per run. An app password, never the account password. */
  async function login() {
    if (session) return session;
    if (!password) throw new Error(`${cfg.tokenEnv} is not set`);
    const res = await call("com.atproto.server.createSession", {
      method: "POST",
      auth: false,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: cfg.identifier, password }),
    });
    session = await res.json();
    return session;
  }

  /**
   * Upload one image as a blob. Does not create a post - an unreferenced blob
   * is discarded by the server, which is what makes this safe to test with.
   */
  async function uploadImage(image, { rootDir = process.cwd() } = {}) {
    // `upload` is the eleventy-img WebP; the original can be 21 MB. Same rule
    // as the Mastodon target.
    const file = path.resolve(rootDir, image.upload ?? image.src);
    const bytes = await readFile(file);
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new Error(`${image.upload ?? image.src} is ${bytes.byteLength} bytes, over Bluesky's limit of ${MAX_IMAGE_BYTES}`);
    }
    const res = await call("com.atproto.repo.uploadBlob", {
      method: "POST",
      headers: { "Content-Type": mimeFor(file) },
      body: bytes,
    });
    const { blob } = await res.json();
    const out = { alt: image.alt ?? "", image: blob };
    const size = webpSize(bytes);
    if (size) out.aspectRatio = size;
    return out;
  }

  /** handle -> DID for every mention in the text. Unknown handles are left out. */
  async function resolveMentions(text) {
    const dids = {};
    for (const { handle } of findMentions(text)) {
      const key = handle.toLowerCase();
      if (key in dids) continue;
      try {
        const res = await call("com.atproto.identity.resolveHandle", { query: { handle: key } });
        dids[key] = (await res.json()).did;
      } catch {
        // Not a Bluesky account (any more). The handle posts as plain text.
      }
    }
    return dids;
  }

  return {
    name: "bluesky",

    // Exposed so the login and upload paths can be checked against the real
    // account without creating a post.
    login,
    uploadImage,

    /**
     * Post one item. Returns { id, url }: the at:// URI goes into state.json,
     * the bsky.app link into the log.
     *
     * Bluesky has no Idempotency-Key, so state.json is the only guard against
     * a repost; syndicate.mjs writes it after every success.
     */
    async post({ text, images = [], item, rootDir }) {
      const post = blueskyPost(text, item);
      const { did } = await login();
      const record = {
        $type: "app.bsky.feed.post",
        text: post.text,
        createdAt: now().toISOString(),
      };
      const richtext = facets(post.text, await resolveMentions(post.text));
      if (richtext.length) record.facets = richtext;
      if (cfg.language) record.langs = [cfg.language];

      // Decision B3: images or a link card, never both. The card is only for a
      // post that links to its own page on flohgro.com - blog posts and
      // shortened posts - and is built from the queue, not by fetching the page.
      if (images.length) {
        const uploaded = [];
        for (const image of images.slice(0, maxImages)) uploaded.push(await uploadImage(image, { rootDir }));
        record.embed = { $type: "app.bsky.embed.images", images: uploaded };
      } else if (item.url && post.text.includes(item.url)) {
        record.embed = {
          $type: "app.bsky.embed.external",
          external: { uri: item.url, title: item.title || "FlohGro", description: "" },
        };
      }

      const res = await call("com.atproto.repo.createRecord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: did, collection: "app.bsky.feed.post", record }),
      });
      const { uri } = await res.json();
      return { id: uri, url: `https://bsky.app/profile/${cfg.identifier}/post/${uri.split("/").pop()}` };
    },
  };
}
