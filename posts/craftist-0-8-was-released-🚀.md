---
title: Craftist 0.8 was released 🚀
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-05-30T05:06:37.000Z
metadata:
  categories:
    - craftist
  tags:
    - todoist
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=438
  type: wordpress
  url: https://flohgro.com/craftist/craftist-0-8-was-released-%f0%9f%9a%80/
tags:
  - craftist
  - craft
  - todoist
---
My Craft eXtension for Todoist just got better 👍️

Find all the details below 📝 and download ⬇️ the new release from the GitHub repository:

[https://github.com/FlohGro-dev/Craftist](https://github.com/FlohGro-dev/Craftist)

⚠️ After reinstalling the newest version – make sure to login with your API token again.

Let me know if you like the new release and what you would like to see additionally 📬️. I already have some (challenging) requests in the pipeline but appreciate your feedback 👌

**🆕 tab layout** 🖌️

now the features are separated from the settings and info in tabs to reduce the clutter in the eXtension

The settings are not hidden behind a button anymore – instead they are directly displayed in the corresponding tab

**🆕 Info tab ℹ️ with Version Check ✅**

The new info tab checks if the installed version is the latest available version and displays some informative text.

Thanks to @DharamKapila for the inspiration, help and permission here!

**🆕 Import Tasks with Label 🏷️**

You can now import all tasks with a selected label into the current document / page

To select a label just open the dropdown menu in the new “Import Tasks with Label” button and click on the label whose tasks you want to import

**🆒 setting to exclude tasks assigned to others 🦦**

You can now select if you want to import tasks assigned to others in shared projects or if you just want to import tasks assigned to you or unassigned.

**🆒 shortened links to tasks 🩳**

Links to tasks now use a more compact layout for mobile (App) 📱 and web 🌐 links with emojis. This reduces the clutter and shortenes the displayed text for imported tasks

**🆒 due strings for recurring tasks 🕵️**

The due strings are now imported for recurring tasks – this hopefully simplifies to determine the repeating frequency of a task

**🐛 no importing of completed (sub-) tasks anymore**

No already completed (sub-)tasks are imported anymore – this could happen in some circumstances when the parent task was not completed but (some) subtasks already were

**🐛 fixed edge case for recurring tasks**

previously if an instance of a recurring task was completed in Todoist first, and then in Craft – syncing the task states also completed the next instance of the task in Todoist. This is now fixed – recurring tasks are only completed if the due date matches between Todoist and Craft.

I hope you like this new update 😎

Again if you have any questions ❓️issues 🪲 or have other feature requests 🧑‍💻 please let me know 🗣️

If you want to support my work on Craftist or other projects checkout [https://flohgro.com/donate](https://flohgro.com/donate)

Have a great day ✌🏼