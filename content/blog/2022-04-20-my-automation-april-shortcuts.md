---
title: My Automation April Shortcuts
date: '2022-04-20T16:30:00.000Z'
tags:
- ios-shortcuts
---
While Automation April by [MacStories](www.macstories.net) is still for another week – the deadline for the [Automation April Shortcuts Contest](https://www.macstories.net/stories/enter-your-shortcuts-in-the-automation-april-shortcuts-contest/) is today.  
I want to share the Shortcuts I submitted to the contest with you.

The first one _“BE PRODUCTIVE BOTCUT”_ is of course productivity related and should help you doing and reflecting on focused working sessions. Additionally It suggests effective breaks you can make during your working day.  
The second shortcut _”LinkCut”_ is an easy to use solution to store and retrieve often used (markdown) links.

You’ll find the descriptions and the download links below. Let me know if you find them useful.

## BE PRODUCTIVE BOTCUT

BE PRODUCTIVE BOTCUT – a shortcut to support you being productive and make effective breaks.

This shortcut helps you to do (or to schedule) sessions of focused work, reflect on them, and make effective breaks in between or afterwards.

I made this shortcut after reading and learning many things about Deep Working. I use it to kick off deep working sessions with no distractions for a limited time. After the session ends I quickly reflect if I achieved what I wanted and then make an effective break to help my brain to relax. This helps me a lot for the next focused work sessions and get the right things done in less time. Also typing the focus task and the reflections into the questions of the shortcuts sets me into the right mood of doing.

When you run the shortcut you can either choose to start a focus session or directly get inspirations to make an effective break.

If you choose to start a focus session the shortcut will ask you for the duration and the task you want to complete. The shortcut will run additionally configured shortcuts at the beginning (to e.g. set HomeKit scenes / start time tracking,…) and create a reminder for the end time of your focus session.

At the end of your session the reminder will notify you – when you open the reminder you can simply click on the link in the reminder (to run the BE PRODUCTIVE BOTCUT) which will start a reflection session for the focus session. The questions for the reflection are customizable for your personal taste. After the reflection you can choose to start a new session, schedule a new session for later, make a break or finish working.

The reminders created by this shortcut will be marked as complete automatically when you run the shortcut from the links inside the reminders.

You can just start using the BE PRODUCTIVE BOTCUT without customizing and see if it works for you with the default settings or read through the customization options at the beginning of the shortcut to customize it to your needs.

During Automation April I combined several Shortcuts I used into this single shortcut and came up with the idea to use dictionaries as inputs to distinguish different actions in a single shortcuts with different input parameters in the dictionary depending on the intended action. Running the Shortcut with those parameters from Reminders does not require any Third-Party apps which I wanted to make it usable for as many people as possible.

WARNING: When you change the name of the shortcut (or just duplicate it to make your own modifications) you have to adapt the name in the configuration text in user define „5)“

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/7c300009bb0248efa0f2a43f9864412a)

## LinkCut

LinkCut – a Shortcut to easily store / retrieve often used (markdown) links.

LinkCut was designed as an easy to use Shortcut to either store or retrieve links in the required format. Links will be stored in the Shortcuts directory of iCloud Drive. This enables usage of LinkCut without any Third Party App and it works right out of the box. Because of iCloud sync you’ll have your stored links available on all your devices.

#### Usage of LinkCut

If you share any link via the ShareSheet to this Shortcut (on iOS/iPadOS) you can store this link in the LinkCut directory to quickly retrieve it later (on any of your devices). To store a Link you first need to choose an existing (or create a new) category and give the link a title – this title will also be used as title when you later retrieve it and copy the md url.  
Note: On the Mac you can store links, too. If you run this shortcut on a mac (with no provided input) it will ask you if you want to retrieve or store a link. If you select to store a link, the frontmost webpage in safari will be used – this is working as expected when Safari is the active window – with Safari in the background this could lead to errors out of my control.

It is totally fine to store a link in two (or more) categories, this is entirely up to you.

If you run this Shortcut from a widget / the Shortcuts app or a Launcher App without an input, you can select a category and then one or more links from that category.  
LinkCut offers different options to interact with selected links:

- remove them from the store
- open them
- copy the url(s)
- copy the markdown url(s)

If the Shortcut detects that you either selected an empty category or removed the last link from a category you’ll have the option to delete the category, too.

LinkCuts interacts only with files in its folder and will ask for permissions to access / store / delete files especially when you use it the first time(s).

### How LinkCut works

Under the hood LinkCut uses markdown files which are stored in the Shortcuts directory of LinkCut at the specified path (below). Each category is represented by a single markdwon file.  
If you want to store (or remove) a lot of links you also can edit the markdown files in the directory and add your markdown formatted links directly into the file.  
Please ensure that you don’t insert empty lines in the file (also not at the end after the last link)

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/ee1a479d5bd442469ffcf9d044eb4416)