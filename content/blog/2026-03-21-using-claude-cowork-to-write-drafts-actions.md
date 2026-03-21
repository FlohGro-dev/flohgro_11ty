---
  title: Using Claude Cowork to Write Drafts Actions
  date: 2026-03-21T23:46:58.534+01:00
  tags: ["drafts-actions","drafts","ai"]
  permalink: /blog/using-claude-cowork-to-write-drafts-actions/index.html
  summary: "How I set up Claude Cowork and Dispatch to write Drafts action scripts — I describe what I want on my iPhone, Claude creates the script on my Mac and saves it to iCloud Drive, and it's ready to use everywhere. Here's what that workflow looks like in practice."
  _social_post: "I setup Claude Cowork to let me describe a @Drafts action on my iPhone, Claude writes the script on my Mac, and iCloud syncs it everywhere. Here's how I set that up."
---

I've been writing [Drafts](https://getdrafts.com) actions for years, and in at least 90% of them I just use a scripting step to achieve what I want. While it kind of became second nature to me to write those scripts, I have a bit of a mess in maintaining them. Some are just stored in notes, and I run them with an `eval()` function in the action itself. Others completely live within the action's script step. And I also tend to maintain more complicated ones in my iCloud Drive folder of Drafts to also back them up in git repositories when I make changes. I don't really want to know how often I've written the same code snippets in those scripts (e.g. prompts, querying for drafts, ...) and especially on the iPhone this is a bit cumbersome to do.

So I did some testing today and I'm partly blown away. Instead of writing scripts by myself within Drafts, I wanted to give [Claude](https://claude.ai/) a chance to do it for me. But it's not that I'm copying the script back and forth between Drafts and a Claude chat, I use Claude Dispatch (which lets me talk to my Cowork sessions from my iPhone) and Claude Cowork on the connected Mac to create the scripts and then I can immediately try them on the iPhone again.

No copy-pasting (almost), no manual file management. Let me walk you through how this works.

## Scripts Live in iCloud Drive

All generated scripts are stored in a subfolder called `ClaudeCoded/` inside the Drafts iCloud Scripts directory:

```
~/Library/Mobile Documents/iCloud~com~agiletortoise~Drafts5/Documents/Library/Scripts/ClaudeCoded/
```

Since this is iCloud Drive, the scripts sync automatically to all my Apple devices. Update a script on the Mac, and it's instantly available on iPhone and iPad too. This alone is a huge win because I don't have to think about syncing anything manually between apps or devices.

I specifically created a separate folder for Claude-coded actions, so I don't need to give it access to everything else and I can easily distinguish those scripts from my hand-written ones.

## How the Scripts Are Structured

Each script file contains standalone top-level functions. For example, a file might look like this:

```javascript
function doSomething() {
  // ...
}

function doSomethingElse() {
  // ...
}
```

The key idea is that functions are independent and can be called from any Drafts action. Multiple actions can share the same script file, which means the logic can live in one place if it makes sense. When I need to change something, I update (well, actually Claude does) the `.js` file once, and every action that uses it gets the updated behavior immediately.

## Creating a Drafts Action for a Script

Setting up a new action that uses one of these scripts is really simple:

1. Create a new action in Drafts
2. Add a **Script** step
3. Enter just two lines:

```javascript
require("ClaudeCoded/YourScript.js");
doSomething();
```

That's it. The `require()` path is relative to `Library/Scripts/` in the Drafts iCloud folder, so you don't need to spell out the full path. The action is just a pointer to the script file and a call of the function.

## How Claude Fits In

This is where it gets really convenient. When I need a new script, I describe what I want in plain language to Claude via [Cowork](https://claude.com/product/cowork) Dispatch (John Voorhees wrote a great post on [MacStories](https://www.macstories.net/stories/hands-on-with-claude-dispatch-for-cowork/) about it, too). I have a dedicated session called "Drafts Action Writer" with specialized Drafts scripting knowledge (currently with [this skill](https://github.com/kerim/claude-drafts-action-skill)) that Claude routes the request to. Claude writes the script and saves it directly to the `ClaudeCoded/` folder in iCloud Drive. Which is also a git repository that Claude commits the changes to.

Once it's done, Claude responds with the necessary code for the action (`require()` + function call) that I need to copy from the interface.

After that, I just create a new Drafts action with the `require()` line from Claude - no copying code from a chat window, no creating files manually. Once iCloud has synced (which usually finishes before I created the action), the script is ready to use on all my devices.

This workflow has changed how I think about building Drafts actions. It allows me to create small and simple actions even faster. Instead of spending time writing and debugging JavaScript on my iPhone, I focus on what I want the action to do and let Claude handle the implementation. The separation of scripts from actions means I can iterate quickly without touching the actions themselves which saves a lot of taps in the UI.

I've already created some useful actions to manage my prayer list (searching, tagging, creating, archiving) or open drafts via prompts from different folders / tags. Of course, I created many testing actions to test and harden the workflow and I can't wait to build more with it. I'm sure this is capable to create and maintain much more complicated actions, too.

**BUT** depending on what the action should do, I'll have a look at the code because I don't want to lose or expose data by running code that was just created by an LLM. [Runestone](https://runestone.app) is just the perfect app for that on the iPhone. This is even more important for actions shared to [Drafts Directory](https://directory.getdrafts.com) where other users can install them from - I will never share actions without reviewing the code first.

If you're a Drafts power user and haven't tried external scripts yet, I'd really recommend giving this a try. And if you have access to Claude, the combination of AI-generated scripts with iCloud syncing makes this setup pretty hard to beat 😊