// node --test social/syndicate.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { parseArgs, pendingFor, run } from "./syndicate.mjs";

test("parseArgs defaults to a dry run", () => {
  const a = parseArgs([]);
  assert.equal(a.live, false);
  assert.equal(a.max, Infinity);
});

test("parseArgs reads flags and MAX_POSTS_PER_RUN", () => {
  assert.equal(parseArgs(["--live"]).live, true);
  assert.equal(parseArgs(["--max", "3"]).max, 3);
  assert.equal(parseArgs([], { MAX_POSTS_PER_RUN: "1" }).max, 1);
  assert.equal(parseArgs(["--max", "5"], { MAX_POSTS_PER_RUN: "1" }).max, 5, "flag beats env");
  assert.equal(parseArgs(["--target", "mastodon"]).target, "mastodon");
});

test("parseArgs rejects nonsense rather than guessing", () => {
  assert.throws(() => parseArgs(["--nope"]), /Unknown argument/);
  assert.throws(() => parseArgs(["--max", "-1"]), /non-negative/);
  assert.throws(() => parseArgs(["--max", "lots"]), /non-negative/);
});

test("pendingFor skips items already recorded for that target", () => {
  const queue = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const state = { a: { mastodon: "1" }, b: { bluesky: "2" } };
  assert.deepEqual(pendingFor(queue, state, "mastodon").map((i) => i.id), ["b", "c"]);
  assert.deepEqual(pendingFor(queue, state, "bluesky").map((i) => i.id), ["a", "c"]);
});

/** Builds a throwaway repo with a config, a queue and a stub target. */
function fixture({ queue, state, posts = [] } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "synd-"));
  mkdirSync(path.join(root, "social", "targets"), { recursive: true });

  const config = {
    site: "https://example.com",
    queue: "queue.json",
    state: "social/state.json",
    types: { post: { template: "{{ text }}", images: true } },
    targets: { mastodon: { module: "./targets/stub.mjs", maxImages: 4 } },
    replacementsCaseInsensitive: true,
    replacements: [{ find: "@Drafts", replace: { mastodon: "@drafts@indieapps.space" } }],
  };
  writeFileSync(path.join(root, "social", "config.json"), JSON.stringify(config));
  writeFileSync(path.join(root, "queue.json"), JSON.stringify(queue ?? []));
  if (state) writeFileSync(path.join(root, "social", "state.json"), JSON.stringify(state));

  // A stub target that appends to a file, so the test can see what was "posted".
  const sent = path.join(root, "sent.json");
  writeFileSync(
    path.join(root, "social", "targets", "stub.mjs"),
    `import { readFileSync, writeFileSync } from "node:fs";
     export default function create() {
       let n = 0;
       return {
         name: "mastodon",
         limits: { maxChars: 9001, maxImages: 4 },
         async init() {},
         async post({ text, item }) {
           if (text.includes("BOOM")) throw new Error("stub failure");
           const all = JSON.parse(readFileSync(${JSON.stringify(sent)}, "utf8"));
           all.push({ id: item.id, text });
           writeFileSync(${JSON.stringify(sent)}, JSON.stringify(all));
           return { id: "s" + ++n, url: "https://social.lol/" + item.id };
         },
       };
     }`,
  );
  writeFileSync(sent, JSON.stringify(posts));

  return {
    root,
    config: path.join(root, "social", "config.json"),
    sent: () => JSON.parse(readFileSync(sent, "utf8")),
    state: () => {
      const p = path.join(root, "social", "state.json");
      return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
    },
  };
}

const item = (id, text = "hello") => ({ id, type: "post", title: null, text, url: id, images: [] });
const silent = () => {};

test("a dry run posts nothing and writes no state", async () => {
  const f = fixture({ queue: [item("a"), item("b")] });
  const r = await run(["--config", f.config], { env: {}, log: silent });
  assert.equal(r.posted, 0);
  assert.equal(r.dryRun, true);
  assert.equal(r.items.length, 2);
  assert.deepEqual(f.sent(), []);
  assert.equal(f.state(), null, "no state file should be created by a dry run");
});

test("a dry run still renders the real text", async () => {
  const f = fixture({ queue: [item("a", "made with @Drafts")] });
  const r = await run(["--config", f.config], { env: {}, log: silent });
  assert.equal(r.items[0].text, "made with @drafts@indieapps.space");
});

test("--live posts and records the status id", async () => {
  const f = fixture({ queue: [item("a"), item("b")] });
  const r = await run(["--config", f.config, "--live"], { env: {}, log: silent });
  assert.equal(r.posted, 2);
  assert.deepEqual(f.sent().map((s) => s.id), ["a", "b"]);
  assert.deepEqual(f.state(), { a: { mastodon: "s1" }, b: { mastodon: "s2" } });
});

test("already-syndicated items are skipped", async () => {
  const f = fixture({ queue: [item("a"), item("b")], state: { a: { mastodon: "s9" } } });
  const r = await run(["--config", f.config, "--live"], { env: {}, log: silent });
  assert.equal(r.posted, 1);
  assert.deepEqual(f.sent().map((s) => s.id), ["b"]);
});

test("--max limits the run and leaves the rest pending", async () => {
  const f = fixture({ queue: [item("a"), item("b"), item("c")] });
  const r = await run(["--config", f.config, "--live", "--max", "1"], { env: {}, log: silent });
  assert.equal(r.posted, 1);
  assert.equal(r.skipped, 2);
  assert.deepEqual(f.sent().map((s) => s.id), ["a"], "oldest first");
});

test("state is written after each post, so a later failure cannot cause a duplicate", async () => {
  const f = fixture({ queue: [item("a"), item("b", "BOOM"), item("c")] });
  const r = await run(["--config", f.config, "--live"], { env: {}, log: silent });
  assert.equal(r.posted, 2);
  assert.equal(r.failed, 1);
  assert.equal(r.ok, false, "a failure must make the run exit non-zero");
  // "a" was recorded even though "b" failed afterwards.
  assert.deepEqual(f.state(), { a: { mastodon: "s1" }, c: { mastodon: "s2" } });
  // A rerun must not repost "a".
  await run(["--config", f.config, "--live"], { env: {}, log: silent });
  assert.deepEqual(f.sent().map((s) => s.id), ["a", "c"], "no duplicate of a or c");
});

test("--seed records every item and posts nothing", async () => {
  const f = fixture({ queue: [item("a"), item("b")] });
  const r = await run(["--config", f.config, "--seed"], { env: {}, log: silent });
  assert.equal(r.seeded, 2);
  assert.deepEqual(f.sent(), []);
  assert.deepEqual(f.state(), { a: { mastodon: "seeded" }, b: { mastodon: "seeded" } });
  // Nothing is pending afterwards.
  const after = await run(["--config", f.config, "--live"], { env: {}, log: silent });
  assert.equal(after.posted, 0);
});

test("--seed does not overwrite a real status id", async () => {
  const f = fixture({ queue: [item("a")], state: { a: { mastodon: "s42" } } });
  await run(["--config", f.config, "--seed"], { env: {}, log: silent });
  assert.deepEqual(f.state(), { a: { mastodon: "s42" } });
});

test("an unknown target is an error", async () => {
  const f = fixture({ queue: [item("a")] });
  await assert.rejects(
    run(["--config", f.config, "--target", "bluesky"], { env: {}, log: silent }),
    /No target "bluesky"/,
  );
});

test("a missing state file is treated as empty, not as a crash", async () => {
  const f = fixture({ queue: [item("a")] });
  const r = await run(["--config", f.config], { env: {}, log: silent });
  assert.equal(r.items.length, 1);
});

test("--filter narrows the run to matching ids", async () => {
  const f = fixture({ queue: [item("a/keep/1"), item("b/other/2"), item("c/keep/3")] });
  const r = await run(["--config", f.config, "--filter", "keep"], { env: {}, log: silent });
  assert.deepEqual(r.items.map((i) => i.id), ["a/keep/1", "c/keep/3"]);
});

test("--filter still respects state", async () => {
  const f = fixture({ queue: [item("a/keep/1"), item("c/keep/3")], state: { "a/keep/1": { mastodon: "s1" } } });
  const r = await run(["--config", f.config, "--filter", "keep"], { env: {}, log: silent });
  assert.deepEqual(r.items.map((i) => i.id), ["c/keep/3"]);
});

test("an image with no alt text is warned about, not silently posted", async () => {
  const f = fixture({ queue: [{ ...item("a"), images: [{ src: "x.png", alt: "" }] }] });
  const lines = [];
  const r = await run(["--config", f.config], { env: {}, log: (l) => lines.push(l) });
  assert.equal(r.warnings.length, 1);
  assert.deepEqual(r.warnings[0], { id: "a", images: ["x.png"] });
  assert.ok(lines.some((l) => /WARNING.*no alt text/.test(l)));
});

test("the report marks a missing alt text clearly", async () => {
  const { reportMarkdown } = await import("./syndicate.mjs");
  const md = reportMarkdown(
    { posted: 0, failed: 0, items: [{ id: "a", target: "mastodon", text: "hi", images: [{ src: "x.png", alt: "  " }] }] },
    { live: false },
  );
  assert.match(md, /MISSING — will post with no description/);
});
