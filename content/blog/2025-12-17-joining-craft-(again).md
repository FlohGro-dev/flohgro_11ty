---
title: Joining Craft (Again)
date: 2025-12-17T17:36:28.348+01:00
tags: ["drafts","workflow","drafts-action","craft","drafts-action-group"]
permalink: /blog/joining-craft-(again)/index.html
---

On the Thanksgiving weekend I stumbled across an interesting email from the Craft Team. Reading the abbreviations "MCP" and "API" in the subject for the new update got me hooked.

When I moved my personal notes away from Craft more than 2 years ago, the developing path including the abandoned API / eXtensions as it was called back then was one of the biggest reasons to switch to Obsidian. I did a [writeup](https://flohgro.com/blog/a-new-home-for-my-personal-notes/) about my reasons if you want to have a look.

Since then I was happily using [Drafts](https://getdrafts.com/) as my main note-taking app. I wasn't unhappy with that solution and I still can do everything I really need in Drafts but this new Update made me curious to have a look at Craft again - the abandoned eXtensions were one of the main reasons to leave Craft.

So over the Thanksgiving weekend I reinstalled Craft on my iPhone and Mac and used it a bit. It felt like coming home into a note-taking app that once "clicked" for me. Of course a lot has changed & was added since last using Craft but at its core it was familiar. I had a quick look at the API and was able to write a Drafts Action to create new documents and append to daily notes in a couple of minutes. This was great and frictionless as it can be. Previously this was only possible with x-callback-urls (or partly with shortcuts) and I built a lot of actions around that long ago. It once again underlines that [everything should have an API](https://rknight.me/blog/im-done-with-closed-services/). The announcement of their [Winter Challenge](https://www.craft.do/imagine) also triggered my interest to build more with the API.

Additionally many great things that I was able to do with Craft came back to my mind realizing that I silently was missing those over the years - e.g. easily sharing great-looking documents, the possibility to structure your documents (with sub pages,...) and having images & files inside a document. These things are a big win for me having grown some responsibilities in the last years and could help me there.

I took the chance to grab the discount for the subscription (my old notes were still there and my space was hitting all kinds of limitations) and jumped in.

Logging back into the Slack community and saying hello also felt great to see some familiar faces there again (still do after a few weeks). I didn't expect such a warm welcome there and just after two days back I already had an interview with Lisa the User Research / Product Lead at Craft to share my journey. We had a great conversation 😊

I have not yet defined what I will do with Craft in the end and how it fits into my workflow - but easily sharing great-looking documents and having images / files again in notes is a big win for me alone right now.

Moving on from the note-taking part it was really exciting to see really impressive submissions to the Winter Challenge in the Slack community and I made my first submission with the Drafts Action [Craft Imagine Smart Add](https://directory.getdrafts.com/a/22j) that basically allows to add content to either documents or collections in Craft. This was a good start but once I saw that working I wanted **more**.

A few hours into coding and building up some sleep debt, I was able to ship a new Action Group [CraftWork](https://directory.getdrafts.com/g/22s) which (as of now) includes 17 actions to integrate Drafts and Craft. From quickly appending drafts to your daily notes and seamlessly creating new tasks to creating new documents (in folders) or adding content to collections I build a lot into it.

It was a lot of fun, debugging, testing and a bit of back and forth with some members of the team to fix some small issues - the speed in support is amazing! Finishing up the submission I also created this public [Craft Document](https://craft.flohgro.com/66Ubl1B526lowv) going a bit more into detail about what's possible and how to install it.

Developing and then using this is great 😊. However I am still in the process to create a custom action for myself to import the last ~2 years of notes from Draft just to gather my notes in one place again - it will be messy but given the support of Craft Assistant, good search and upcoming holidays I'm sure I can clean this up where necessary and keep the mess where it's fine.

A few days later when opening Slack I was surprised by actually being chosen as winner for a complex workflow solution - honored to get that much appreciation from the Craft Team for developing this 😍.

So what's the conclusion for this post? I will rework parts of my workflow and integrate Craft again - will this change how I use Drafts? Absolutely! Is this a problem? No 😊 I think Drafts will (once again) fulfill the tagline of the app **Where Text Starts** and I think more notes will end up in Craft, where I continue working, finalize or share them.

I have more ideas on what to build for the Craft API - on top of my wishlist is reviving [Craftist](https://github.com/FlohGro-dev/Craftist) again to integrate Craft and Todoist similar to what I did in the first iteration of eXtensions. This involves a lot more technologies that I'm not very experienced with, but who knows, maybe I can get this working.

I would love to hear if you're interested in something like that, if you're using CraftWork and hear from other great submissions to the Winter Challenge.