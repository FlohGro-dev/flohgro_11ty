// Mastodon target. Node 20 globals only - fetch, FormData, Blob. No deps.
//
// Deviation from the interface sketch in docs/echofeed-starting-point.md: the
// default export is a factory rather than a bare object, because a target needs
// its instance URL and token before it can do anything. The object it returns
// has the documented shape - { name, limits, post({ text, images, item }) }.
//
// See docs/echofeed-migration.md.

import { readFile } from "node:fs/promises";
import path from "node:path";

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".heic": "image/heic",
};

// Conservative fallback, only used if the instance will not tell us. social.lol
// is configured far above this; the real value is read at init.
const DEFAULT_MAX_CHARS = 500;
const MEDIA_POLL_TIMEOUT_MS = 60_000;
const MEDIA_POLL_INTERVAL_MS = 1_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  const mime = MIME[ext];
  if (!mime) throw new Error(`Unsupported image type "${ext}" for ${file}`);
  return mime;
}

/**
 * Pull the real limits off the instance instead of hard-coding them.
 * v2 first, v1 as a fallback - older instances only have v1.
 */
export function limitsFrom(instanceJson) {
  const c = instanceJson?.configuration ?? {};
  return {
    maxChars: c.statuses?.max_characters ?? DEFAULT_MAX_CHARS,
    maxImages: c.statuses?.max_media_attachments ?? 4,
    maxImageBytes: c.media_attachments?.image_size_limit ?? null,
  };
}

export default function createMastodon(cfg, { env = process.env, fetch: f = globalThis.fetch } = {}) {
  const base = String(cfg.instance).replace(/\/+$/, "");
  const token = env[cfg.tokenEnv];

  let limits = { maxChars: DEFAULT_MAX_CHARS, maxImages: cfg.maxImages ?? 4, maxImageBytes: null };

  async function call(pathname, { method = "GET", body, headers = {}, retries = 2 } = {}) {
    if (!token) throw new Error(`${cfg.tokenEnv} is not set`);
    const res = await f(`${base}${pathname}`, {
      method,
      body,
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json", ...headers },
    });

    // Mastodon rate limiting. Retry-After is in seconds.
    if (res.status === 429 && retries > 0) {
      const wait = Number(res.headers.get("retry-after") ?? 5) * 1000;
      await sleep(wait);
      return call(pathname, { method, body, headers, retries: retries - 1 });
    }

    if (!res.ok && res.status !== 202 && res.status !== 206) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Mastodon ${method} ${pathname} failed: ${res.status} ${detail.slice(0, 300)}`);
    }
    return res;
  }

  /**
   * Upload one image and wait until the instance has finished processing it.
   *
   * /api/v2/media returns 200 when the attachment is ready and 202 when it is
   * still being processed. A status posted with an id that is not ready yet is
   * rejected, so we poll /api/v1/media/:id until it returns 200. While
   * processing, that endpoint answers 206.
   */
  async function uploadImage(image, { rootDir = process.cwd() } = {}) {
    const file = path.resolve(rootDir, image.src);
    const bytes = await readFile(file);

    if (limits.maxImageBytes && bytes.byteLength > limits.maxImageBytes) {
      throw new Error(
        `${image.src} is ${bytes.byteLength} bytes, over the instance limit of ${limits.maxImageBytes}`,
      );
    }

    const form = new FormData();
    form.append("file", new Blob([bytes], { type: mimeFor(file) }), path.basename(file));
    // Alt text. The queue guarantees this is non-empty for every image.
    if (image.alt) form.append("description", image.alt);

    const res = await call("/api/v2/media", { method: "POST", body: form });
    const media = await res.json();
    if (res.status === 200) return media.id;

    const deadline = Date.now() + MEDIA_POLL_TIMEOUT_MS;
    while (Date.now() < deadline) {
      await sleep(MEDIA_POLL_INTERVAL_MS);
      const poll = await call(`/api/v1/media/${media.id}`);
      if (poll.status === 200) return media.id;
    }
    throw new Error(`Timed out waiting for ${image.src} to finish processing`);
  }

  return {
    name: "mastodon",

    get limits() {
      return limits;
    },

    /** Read the instance's real limits. Safe to call before any posting. */
    async init() {
      for (const p of ["/api/v2/instance", "/api/v1/instance"]) {
        try {
          const res = await call(p);
          limits = limitsFrom(await res.json());
          if (cfg.maxImages) limits.maxImages = Math.min(limits.maxImages, cfg.maxImages);
          return limits;
        } catch {
          // try the older endpoint
        }
      }
      return limits;
    },

    /**
     * Post one item. Returns { id, url } of the created status.
     *
     * The Idempotency-Key is the queue item id. Mastodon dedupes on it for
     * about an hour, which is a server-side safety net if the state file is
     * ever wrong or a run is repeated.
     */
    async post({ text, images = [], item, rootDir }) {
      if (text.length > limits.maxChars) {
        throw new Error(
          `${item.id} renders to ${text.length} characters, over the instance limit of ${limits.maxChars}`,
        );
      }

      const mediaIds = [];
      for (const image of images.slice(0, limits.maxImages)) {
        mediaIds.push(await uploadImage(image, { rootDir }));
      }

      const body = new FormData();
      body.append("status", text);
      body.append("visibility", cfg.visibility ?? "public");
      if (cfg.language) body.append("language", cfg.language);
      for (const id of mediaIds) body.append("media_ids[]", id);

      const res = await call("/api/v1/statuses", {
        method: "POST",
        body,
        headers: { "Idempotency-Key": item.id },
      });
      const status = await res.json();
      return { id: status.id, url: status.url };
    },
  };
}
