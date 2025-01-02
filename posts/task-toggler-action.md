---
title: Task Toggler Action
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2024-03-08T20:47:22.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - drafts
    - drafts-actions
    - drafts-editor
    - drafts-lists
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=693
  type: wordpress
  url: https://flohgro.com/drafts-actions/task-toggler-action/
tags:
  - drafts-actions
  - drafts
---
Lately I’ve been creating a lot of checklists or just notes with tasks within [Drafts](https://getdrafts.com). I used an action that allows to toggle the states of these tasks in the selected range (either the line where the cursor is located or multiple selected lines). This worked but was not fitting my use cases. I also wanted the possibility to make a task out of a bullet point or a line with just text in it without creating another action that I need to trigger separately.

Of course I sat down and it took me embarrassingly long to script a (so far) perfectly working action for me. Using `md task toggler` I only need to press one keyboard shortcut (or icon in the ActionBar) to toggle the state of the tasks in the selected range or add checkboxes to lines where they are missing.  
Of course the indentation of lines remains unchanged.

![]({{ baseUrl }}/assets/CleanShot-2024-03-08-at-22.16.-0ezUzsqq5avO.gif)

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/2QU)