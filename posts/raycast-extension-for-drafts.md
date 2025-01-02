---
title: Raycast Extension for Drafts
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2024-03-14T10:23:00.000Z
metadata:
  categories:
    - raycast
  tags:
    - drafts
    - raycast
    - raycast-extension
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=701
  type: wordpress
  url: https://flohgro.com/raycast/raycast-extension-for-drafts/
tags:
  - raycast
  - drafts
---
I updated my Raycast extension for Drafts with the new command `Create Draft from Selection` that will create a new draft from the currently selected text 🥳. It was a suggestion by a user of it, and I (finally) took some time to add it and really enjoy using it!

Whenever you want to create a new Draft with text from e.g. a webpage/another app/file contents/you name it, just select it and invoke the new command of the Raycast extension. This will immediately create a new Draft containing your selected text, and you can start taking further notes on it (or move it somewhere else).

You can install the extension from the Raycast store if you’re not already using it: [https://raycast.com/FlohGro/drafts](https://raycast.com/FlohGro/drafts).  
If you do, it should get updated automatically.

Let me know if you have any further suggestions for the extension; I‘m happy to further improve it!

In general, the process of developing an extension for Raycast is great and very well-documented. It was fine when I first created the extension but was refined and improved a lot. Now, I don’t need to fiddle around with GitHub a lot anymore since they introduced a „publish“ command to the tooling they provide. This simplifies creating the pull request to their repository a lot 🙂

Their API docs now (don’t know when it was added) include an AI that you can ask questions to – it helps a lot when you quickly want to search something but don’t know the exact terms/methods you have to use.

In the end, the review of my changes was very fast; in not even 24h, the PR was approved by a member of the Raycast team and merged into the extensions repository 👍🏼.