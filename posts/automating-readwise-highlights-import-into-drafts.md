---
title: Automating Readwise Highlights Import into Drafts
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2024-05-29T11:00:31.000Z
metadata:
  categories:
    - automation
  tags:
    - automation
    - drafts
    - drafts-actions
    - readwise
    - shortcuts
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=759
  type: wordpress
  url: >-
    https://flohgro.com/automation/automating-readwise-highlights-import-into-drafts/
tags:
  - automation
---
Using Shortcuts and a Drafts Action you can automate the import of highlights from Readwise Reader into Drafts once a day.

I absolutely enjoy using [Readwise](https://readwise.io/i/floh) Reader as my RSS and read later service. However, I wanted to make the most of my highlights by importing them into [Drafts](https://getdrafts.com) for review and processing. A while back, I created the [import latest Readwise highlights](https://directory.getdrafts.com/a/2Mt) action, which pulls all the new highlights into Drafts. The only downside was having to manually run this action, which was quite inconvenient and in the end of course didn’t work out..

Luckily there is a solution to automatically run this action once every day using Shortcuts.  
My first attempt to set it up as a scheduled automation didn’t work since running the action requires Drafts to be opened. This isn’t always possible, especially when the device is locked.  
However, I found an effective workaround that involved setting up a personal automation to log the last time Drafts was opened in a file. This enables Shortcuts to determine whether Drafts had been opened that day and trigger the import action accordingly.  
Testing it for the first time – I quickly noticed that the original action for importing highlights always loaded a Draft into the editor, potentially disrupting your workflow. To address this issue, I created a modified version of the action specifically for automated execution. This tweaked version imports the new highlights without interfering with your tasks.

If you’re interested in automating the process of importing Readwise highlights or any other action you (want to) run on a regular basis, here is what you need to do:

1.  Get the [import latest Readwise highlights (automated)](https://directory.getdrafts.com/a/2Sa) action (of course this is not necessary if you want to run another action)
2.  Download and set up the [Import Reading Highlights Drafts Automation](https://www.icloud.com/shortcuts/4e9f6c7995e94487997b7c2f1a45a696) Shortcut (you need to select the action you want to run during installation).
3.  Create a personal automation in Shortcuts that triggers the Shortcut as soon as you open Drafts.