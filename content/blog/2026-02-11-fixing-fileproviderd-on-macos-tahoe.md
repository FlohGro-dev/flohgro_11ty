---
  title: Fixing fileproviderd on macOS Tahoe
  date: 2026-02-11T21:54:34.936+01:00
  tags: ["macOS","ai"]
  permalink: /blog/fixing-fileproviderd-on-macos-tahoe/index.html
  summary: "macOS Tahoe & fileproviderd broke all my file operations for more than three months until I finally fixed it"
  _social_post: "#macOS Tahoe broke all my file operations for more than three monts until I finally fixed it with the help of a post b @klickreflex@freiburg.social and AI supported debugging."
---

Since I upgraded to macOS Tahoe back in September, I had huge issues when working with files. It took way longer than you'd expect to open, quick look, rename, delete, create, move,… files.

The Activity Monitor showed `fileproviderd` eating 95%+ CPU. Permanently. I was more and more frustrated using the Finder and doing any kind of file operations on my Mac. The bad thing was that this also drifted down into Drafts when referencing files or scripts in my iCloud Drive folder, or e.g., DEVONthink when accessing indexed folders. It just felt like my Mac didn't want me to use it.

The most annoying part: this isn't rare. Apple's own support forums have threads with many people reporting the exact same thing. I was hopeful that one of the 26.x updates would fix it, but until now, they have not.

TL;DR: I fixed it by toggling iCloud Drive off and on again, and then signing out and in again with my Apple account.

## My (stupid) Workaround

I quickly found out that I could speedup those operations when force-quitting the `fileproviderd` process. The quickest way for me to kill it was to use the [Kill Process](https://www.raycast.com/rolandleth/kill-process) extension for [Raycast](https://www.raycast.com/hey/081e003e). I added the command to the top of my favorites, and then I just needed to trigger Raycast, hit Enter to list the running processes, and in 99% of the cases, the `fileproviderd` process was on top of the list. Killing it by pressing Enter again solved my issues in most cases.

Of course, this was not intended for a mid-/long-term use, but here we are - I used this workaround for around 3 months until it got worse and worse, and I had to dig deeper.

## Down the rabbit hole

> First of all, I want to emphasize that I am by no means an expert on this topic. I carefully read the outputs of Perplexity and Claude and verified a few commands with standard web searches. Be careful when trying this stuff, and maybe the end of the post (my "real fix") will help you more than this trip down the rabbit hole.

I used Perplexity to research the problem and found a bunch of forum posts, Apple Community threads, and one really thorough write-up by [Daniel Wentsch](https://freiburg.social/@klickreflex): [The Week I Spent Fixing My MacBook's Post-Tahoe Performance Issues](https://medium.zettel.org/the-week-i-spent-fixing-my-macbooks-post-tahoe-performance-issues-daccb150dbf8). His analysis identifies three main problems after the Tahoe upgrade:

1. Ghost FileProvider extensions from apps you uninstalled ages ago - this affects all macOS versions, but the Tahoe upgrade triggers it.
2. A WindowServer bug with Electron apps like VS Code, Slack, Discord (Tahoe-specific)
3. NSAutoHeuristic, a new input-prediction "feature" that causes typing lag (also Tahoe-specific)

The ghost extensions are the big ones. Every cloud storage app you ever installed (Google Drive, Dropbox, CloudMounter, whatever) registers a FileProvider extension. Even when uninstalling the app, the extension data stays. On Tahoe, `fileproviderd` goes into a loop trying to reconcile these dead entries. Daniel measured 16+ hours of continuous rescanning every second on his machine.

The Perplexity research also surfaced some other common fixes people tried - deleting the entire FileProvider folder, disabling Spotlight indexing for cloud folders, or toggling iCloud Drive. Some of those helped partially for some time, but none addressed the root cause on their own. The only thing I was afraid of was turning off iCloud Drive and signing out with my Apple account - so I skipped this for now.

I started debugging back and forth with [Claude](https://claude.ai/) to go through the terminal diagnostics step by step. Running `brctl log -w --shorten` showed only iCloud Drive as a provider - no third-party ghosts like Google Drive or Dropbox. So far so good.

But when running brctl status, it showed 574 containers. Almost all of them marked SYNC DISABLED (app not installed). Years of installed and uninstalled apps, all still tracked by `fileproviderd`. Every reconciliation pass had to load and check all 574 of them. The log was full of scheduler not stable: jobs are running` messages, dozens per millisecond, with no productive work being done.

Additionally, I found an orphaned 215MB database in ~/Library/Application Support/FileProvider/ - a UUID-named directory that didn't belong to any active provider. I confirmed this by checking which providers were actually registered:

```bash
pluginkit -m -p com.apple.fileprovider-nonui
```

Only iCloud Drive and Photos showed up. Nobody owned that 215MB database. It was just sitting there, being processed for nothing.

In addition to this, I also found out that you can run a consistency check against the FileProvider database.

```bash
fileproviderctl check -v
```

With this, I got some results that didn't look so good:

> FPCK for Mobile Documents:  
> ❌ disk <-> FSSnapshot failed on 174/159988 files.  
> ✅ FSSnapshot <-> FPSnapshot succeeded on 159988 files.  
> ❌ ReconciliationTable checks failed on 5/159988 files

Claude was actually a great help with interpreting the output and digging further into this. I found a lot of empty files lying around in my iCloud Drive, and it seemed like those five items in the ReconciliationTable could be an issue.

I ran the repair command against my iCloud Drive directory, and three of the five broken files were fixed by that.

```bash
fileproviderctl repair -v -a ~/Library/Mobile\ Documents
```

Moving on, I wanted to clean up those empty files and used several commands like this to find different types of empty files from the huge output of the `fileproviderctl check -v` command:

```bash
find ~/Documents ~/Library/Mobile\ Documents -name '*.lock' -type f -size 0
```

Adding -delete to that command would delete the matching files immediately, but I made sure to check each and every file before deleting them. To find different types of files you need to replace the '*.lock' with different file types.

Finally, we made some progress, and first, it seems like this fixed my problems.

> FPCK for Mobile Documents:  
> ❌ disk <-> FSSnapshot failed on 17/159923 files.  
> ✅ FSSnapshot <-> FPSnapshot succeeded on 159923 files.  
> ✅ ReconciliationTable checks succeeded on 159923 files.

However, the next day, my issues were back…

## Actually Fixing It

After nothing of the terminal stuff seemed to fix the problems, I finally decided I'd toggle off and on iCloud Drive. I went into settings, turned it off, and selected to "Keep a Copy" of my files. Did a reboot and turned it on again.

Fair warning: the initial re-sync takes a while, and the CPU will spike during that time. That's expected. Give it some time.

Again it first seemed to be better but in the end didn't resolve the problems so I pulled the final plug and signed out off my Apple account on the Mac already prepared to completely erase the Mac and do a clean install… After signing back in and letting it sync overnight I found newly created Calendars and also all my contacts were duplicated. Fixing this took a bit but then it finally looked good. A week later I can say that `fileproviderd` is back at normal operation and file operations now are lightning fast again.

Should I have done that earlier? Probably, but sometimes you need to learn it the hard way.  
For the sake of completeness, I still applied all the fixes Daniel mentioned in his post, just to be sure, so it could definitely be a combination of these things.

## But Honestly

I shouldn't have had to spend hours debugging this. A macOS upgrade shouldn't break your machine, especially those foundational things like file operations. And the fact that Apple hasn't fixed this with an OS update in more than three months is just ridiculous. I can't believe that there are no tests for those things before delivering the update.

What saved me a lot of time was using AI for the research and debugging. I used Perplexity to research the problem and found Daniel's analysis and other reports, and then Claude to work through the terminal debugging, analyzing logs, and quickly getting help to interpret the presented data. This would have taken me a lot longer without the help of LLMs.

If you're dealing with the same `fileproviderd` nightmare, toggle iCloud Drive first, and if it doesn't help, sign out and in again with your Apple account. I hope this saves you some time.

