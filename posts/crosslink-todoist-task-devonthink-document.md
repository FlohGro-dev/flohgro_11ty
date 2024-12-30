---
title: crosslink Todoist task &#038; DEVONthink document
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-02-28T18:50:32.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - devonthink
    - devonthink-crosslink
    - todoist
    - todoist-crosslink
  uuid: 11ty/import::wordpress::https://flohgro.com/web/?p=295
  type: wordpress
  url: >-
    https://flohgro.com/drafts-actions/crosslink-todoist-task-devonthink-document/
tags:
  - drafts-actions
---
This action will create a cross-linked Task between Todoist and a DEVONthink document.

_NOTE: this action will NOT work on macOS since the URL scheme of DEVONthink doesn’t support this_

A new markdown document will be created in DTTG from the content of the current draft with the first line as title.

The DEVONthink item will be created in the global inbox.

After the document is created the action will create a new task in the inbox of your Todoist account with the title of the markdown document as task name. The task will contain a clickable link to open the corresponding DEVONthink document

When the task was created the action will prepend a link to it into the created markdown document.

_known “issue”: if you quickly open the link to the Todoist task after the action prepended the link to the task to the Craft document, your Todoist app may show an error telling you that the task could not be found. The reason for this is, that Todoist needs to sync the created task to your app first (the task is created via the REST API). After the task was synced, the error won’t occur again._

## \[Configuration\]

_no configuration needed_ just install the action (and have DTTG installed on your iPhone.

Technically it would be possible to directly create the DEVONthink item in another group but it would need individual configuration. If you need this please reach out to me.

## \[Usage\]

Use this action to create a cross-linked task / document between your task manager and DEVONthink. If you e.g. took some notes during a meeting or while reading a book / blog in Drafts which you need to review or complete later – just run this action. It will help you to quickly navigate between the task and the document without seeing distracting other content.

[GET THE ACTION](https://directory.getdrafts.com/a/1lu)