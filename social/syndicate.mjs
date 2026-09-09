#!/usr/bin/env node
// Syndication CLI. Reads social-queue.json, skips everything already recorded in
// state.json, and posts what is left to the configured targets.
//
// No GitHub Actions coupling: no @actions/core, no action.yml. Config comes from
// a file path, secrets from the environment. Runs identically on a Mac and in CI.
//
//   node social/syndicate.mjs                    # dry run, shows everything pending
//   node social/syndicate.mjs --max 5            # dry run, first 5
//   node social/syndicate.mjs --live --max 1     # actually posts one
//   node social/syndicate.mjs --seed             # record every queue item, post nothing
//
// POSTING IS OPT-IN. Without --live this never sends a request that creates a
// status. See docs/echofeed-migration.md.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderItem } from "./render.mjs";

const HELP = `
Usage: node social/syndicate.mjs [options]

  --live            Actually post. Without this, the run is a dry run.
  --max <n>         Post at most n items (env: MAX_POSTS_PER_RUN).
  --target <name>   Only this target. Default: every target in the config.
  --config <path>   Default: social/config.json
  --seed            Mark every queue item as already syndicated, post nothing.
  --filter <text>   Only items whose id contains this text. Useful for trying
                    template variants against a few test entries.
  --report <path>   Write a readable Markdown report of the run.
  --quiet           Only print the summary.
  --help
`;

/** A Markdown rendering of a run, for reading and cross-checking by eye. */
export function reportMarkdown(results, { live }) {
  const lines = [
    `# Syndication ${live ? "run" : "dry run"}`,
    "",
    live
      ? `${results.posted} posted, ${results.failed} failed.`
      : `${results.items.length} item(s) that **would** be posted. Nothing was sent.`,
    "",
  ];
  for (const it of results.items) {
    lines.push(`## ${it.id}`, "");
    lines.push(`- target: \`${it.target}\``);
    if (it.text !== undefined) lines.push(`- length: ${it.text.length} characters`);
    if (it.images?.length) {
      lines.push(`- images (${it.images.length}):`);
      for (const img of it.images) {
        lines.push(
          `  - \`${img.src}\` — alt: ${img.alt?.trim() ? img.alt : "**MISSING — will post with no description**"}`,
        );
      }
    } else if (it.images) {
      lines.push("- images: none");
    }
    if (it.url) lines.push(`- posted to: ${it.url}`);
    if (it.text !== undefined) lines.push("", "```", it.text, "```");
    lines.push("");
  }
  return lines.join("\n");
}

export function parseArgs(argv, env = {}) {
  const args = {
    live: false,
    seed: false,
    quiet: false,
    help: false,
    max: env.MAX_POSTS_PER_RUN ? Number(env.MAX_POSTS_PER_RUN) : Infinity,
    target: null,
    config: "social/config.json",
    report: null,
    filter: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--live") args.live = true;
    else if (a === "--seed") args.seed = true;
    else if (a === "--quiet") args.quiet = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--max") args.max = Number(argv[++i]);
    else if (a === "--target") args.target = argv[++i];
    else if (a === "--config") args.config = argv[++i];
    else if (a === "--report") args.report = argv[++i];
    else if (a === "--filter") args.filter = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (Number.isNaN(args.max) || args.max < 0) throw new Error("--max must be a non-negative number");
  return args;
}

const readJson = async (file, fallback) => {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT" && fallback !== undefined) return fallback;
    throw err;
  }
};

/** Items with no recorded status for this target, oldest first. */
export function pendingFor(queue, state, target, filter = null) {
  return queue.filter(
    (item) => !state[item.id]?.[target] && (!filter || item.id.includes(filter)),
  );
}

export async function run(argv = [], { env = process.env, log = console.log } = {}) {
  const args = parseArgs(argv, env);
  if (args.help) {
    log(HELP.trim());
    return { ok: true };
  }

  const configPath = path.resolve(args.config);
  const rootDir = path.dirname(path.dirname(configPath)); // repo root
  const config = await readJson(configPath);

  const queuePath = path.resolve(rootDir, config.queue);
  const statePath = path.resolve(rootDir, config.state);
  const queue = await readJson(queuePath);
  const state = await readJson(statePath, {});

  const targetNames = args.target ? [args.target] : Object.keys(config.targets);
  for (const name of targetNames) {
    if (!config.targets[name]) throw new Error(`No target "${name}" in ${args.config}`);
  }

  // --seed: record everything, contact nobody. This is how the backlog of 334
  // already-published items is prevented from flooding the timeline.
  if (args.seed) {
    for (const item of queue) {
      state[item.id] ??= {};
      for (const name of targetNames) state[item.id][name] ??= "seeded";
    }
    await writeFile(statePath, JSON.stringify(state, null, 2) + "\n");
    log(`Seeded ${queue.length} items for ${targetNames.join(", ")} in ${config.state}`);
    return { ok: true, seeded: queue.length };
  }

  const results = { posted: 0, skipped: 0, failed: 0, dryRun: !args.live, items: [], warnings: [] };

  for (const name of targetNames) {
    const targetCfg = config.targets[name];
    const { default: create } = await import(new URL(targetCfg.module, `file://${configPath}`).href);
    const target = create(targetCfg, { env });

    // Read the instance's real limits so a dry run reports the same
    // over-length errors a live run would. Never fatal - a dry run must work
    // offline and without a token.
    if (target.init) {
      try {
        await target.init();
      } catch (err) {
        if (args.live) throw err;
        if (!args.quiet) log(`  (could not read ${name} limits: ${err.message})`);
      }
    }

    const pending = pendingFor(queue, state, name, args.filter);
    const batch = pending.slice(0, args.max === Infinity ? undefined : args.max);
    results.skipped += pending.length - batch.length;

    if (!args.quiet) {
      log(`\n${name}: ${pending.length} pending, ${batch.length} in this run` +
        (args.live ? "" : "  [DRY RUN - nothing will be posted]"));
    }

    for (const item of batch) {
      const { text, images } = renderItem(item, config, name);

      // Alt text goes out as the media "description". An image without one is
      // posted anyway - blocking a whole post over it would be worse - but it
      // must never happen quietly.
      const noAlt = images.filter((i) => !i.alt?.trim());
      if (noAlt.length) {
        results.warnings.push({ id: item.id, images: noAlt.map((i) => i.src) });
        log(`  WARNING ${item.id}: no alt text for ${noAlt.map((i) => i.src).join(", ")}`);
      }

      if (!args.live) {
        if (!args.quiet) {
          log(`\n--- ${item.type} ${item.id}`);
          log(`    ${images.length} image(s)${images.length ? ": " + images.map((i) => i.src).join(", ") : ""}`);
          log(`    ${text.length} chars`);
          log(text.split("\n").map((l) => "  | " + l).join("\n"));
        }
        results.items.push({ id: item.id, target: name, text, images });
        continue;
      }

      try {
        const res = await target.post({ text, images, item, rootDir });
        state[item.id] ??= {};
        state[item.id][name] = res.id;
        // Written after every success, not at the end. A crash mid-run must not
        // lose the record of what already went out, or the next run duplicates.
        await writeFile(statePath, JSON.stringify(state, null, 2) + "\n");
        results.posted++;
        results.items.push({ id: item.id, target: name, url: res.url });
        if (!args.quiet) log(`  posted ${item.id} -> ${res.url}`);
      } catch (err) {
        results.failed++;
        log(`  FAILED ${item.id}: ${err.message}`);
      }
    }
  }

  if (args.report) {
    await writeFile(path.resolve(args.report), reportMarkdown(results, { live: args.live }));
    if (!args.quiet) log(`\nReport written to ${args.report}`);
  }

  if (!args.quiet) {
    log(
      `\n${results.dryRun ? "Dry run" : "Done"}: ${results.posted} posted, ` +
        `${results.failed} failed, ${results.skipped} left for a later run.`,
    );
    if (results.warnings.length) {
      log(`${results.warnings.length} item(s) have images with no alt text (listed above).`);
    }
    if (results.dryRun) log("Nothing was sent. Add --live to post.");
  }
  return { ok: results.failed === 0, ...results };
}

// Only run when executed directly, so the tests can import this file.
if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  run(process.argv.slice(2)).then(
    (r) => process.exit(r.ok ? 0 : 1),
    (err) => {
      console.error(err.message);
      process.exit(1);
    },
  );
}
