#!/usr/bin/env node
// Shows exactly what would be posted to Bluesky, without posting anything.
//
// The syndicate.mjs dry run prints the text BEFORE the Bluesky step, so it
// cannot show shortening or link/hashtag facets. This runs render.mjs and then
// bluesky-text.mjs over the queue - the same two steps the Bluesky target runs.
//
// Never contacts Bluesky. Needs no token. Ignores state.json.
//
//   node social/bluesky-preview.mjs                    # every queue item
//   node social/bluesky-preview.mjs --shortened        # only items that get cut
//   node social/bluesky-preview.mjs --last 10          # newest 10
//   node social/bluesky-preview.mjs --report p.md      # write Markdown to a file
//
// See docs/echofeed-migration.md, "Bluesky".

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { renderItem } from "./render.mjs";
import { blueskyPost, graphemes, findMentions } from "./bluesky-text.mjs";

const TARGET = "bluesky";

const HELP = `
Usage: node social/bluesky-preview.mjs [options]

  --filter <text>   Only items whose id contains this text.
  --last <n>        Only the newest n items.
  --shortened       Only items that are cut to fit 300 graphemes.
  --report <path>   Write the Markdown to a file instead of printing it.
  --config <path>   Default: social/config.json
  --help
`;

export function parseArgs(argv) {
  const args = { config: "social/config.json", filter: null, last: null, shortened: false, report: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--filter") args.filter = argv[++i];
    else if (a === "--last") args.last = Number(argv[++i]);
    else if (a === "--shortened") args.shortened = true;
    else if (a === "--report") args.report = argv[++i];
    else if (a === "--config") args.config = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (args.last !== null && !(args.last > 0)) throw new Error("--last must be a positive number");
  return args;
}

/**
 * Run the Bluesky text step over the queue. One entry per item; an item that
 * cannot be posted carries `error` instead of stopping the preview.
 */
export function preview(queue, config, { filter = null, last = null, shortened = false } = {}) {
  let items = queue.filter((item) => !filter || item.id.includes(filter));
  if (last) items = items.slice(-last);

  const out = items.map((item) => {
    const { text: rendered, images } = renderItem(item, config, TARGET);
    // Decision B3: a post carries images or a link card, never both.
    const base = { id: item.id, type: item.type, images, embed: images.length ? "images" : "link card" };
    try {
      return { ...base, rendered, ...blueskyPost(rendered, item) };
    } catch (err) {
      return { ...base, rendered, shortened: true, error: err.message };
    }
  });
  return shortened ? out.filter((i) => i.shortened) : out;
}

/** Markdown report, for reading by eye. */
export function previewMarkdown(items) {
  const cut = items.filter((i) => i.shortened && !i.error).length;
  const failed = items.filter((i) => i.error).length;
  const lines = [
    "# Bluesky preview",
    "",
    `${items.length} item(s), ${cut} shortened, ${failed} that cannot be posted. Nothing was sent.`,
    "",
  ];
  for (const it of items) {
    lines.push(`## ${it.id}`, "");
    if (it.error) {
      lines.push(`- **ERROR**: ${it.error}`, `- rendered: ${graphemes(it.rendered)} graphemes`, "");
      continue;
    }
    lines.push(
      `- length: ${graphemes(it.text)} graphemes` +
        (it.shortened ? ` (shortened from ${graphemes(it.rendered)})` : ""),
    );
    lines.push(`- embed: ${it.embed}${it.images.length ? ` (${it.images.length})` : ""}`);
    for (const f of it.facets) {
      const feat = f.features[0];
      lines.push(`- ${feat.uri ? `link: ${feat.uri}` : `tag: #${feat.tag}`}`);
    }
    // Offline, so no DID lookup: these become clickable only if the account
    // still exists when the post is sent.
    for (const m of findMentions(it.text)) lines.push(`- mention: @${m.handle} (looked up when posting)`);
    lines.push("", "```", it.text, "```", "");
  }
  return lines.join("\n");
}

export function run(argv, { log = console.log } = {}) {
  const args = parseArgs(argv);
  if (args.help) {
    log(HELP.trim());
    return;
  }
  const configPath = path.resolve(args.config);
  const rootDir = path.dirname(path.dirname(configPath));
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const queue = JSON.parse(readFileSync(path.resolve(rootDir, config.queue), "utf8"));

  const md = previewMarkdown(preview(queue, config, args));
  if (args.report) {
    writeFileSync(path.resolve(args.report), md);
    log(md.split("\n")[2]);
    log(`Report written to ${args.report}`);
  } else {
    log(md);
  }
}

// Only run when executed directly, so the tests can import this file.
if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  try {
    run(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
