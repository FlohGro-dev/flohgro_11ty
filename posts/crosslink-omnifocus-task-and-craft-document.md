---
title: crosslink Omnifocus task and Craft document
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-02-28T18:56:56.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - craft
    - craft-crosslink
    - omnifocus
    - omnifocus-crosslink
  uuid: 11ty/import::wordpress::https://flohgro.com/web/?p=300
  type: wordpress
  url: >-
    https://flohgro.com/drafts-actions/crosslink-omnifocus-task-and-craft-document/
tags:
  - drafts-actions
  - craft
  - omnifocus
---
This action will create a cross-linked Task between Omnifocus and a Craft document.

A new Craft document will be created from the content of the current draft with the first line as title for the document.

After the document is created the action will create a new task in the inbox of your Omnifocus account with the title of the Craft document as task name. The task will contain note with a link to the created Craft document

When the task was created the action will prepend a link to it into the created Craft document.

## \[Configuration\]

If you don’t want to use the (any of my) action for different Craft spaces there is no configuration needed. When you first run any of my Craft actions it will ask you to store the space id of your Craft space. This is a one time action and you don’t need to do it for any other oof my Craft actions you install.

To use these actions with different spaces you need to duplicate the action for each space you want to use it. I recommend to e.g. add a suffix to the action name to describe the space for which you configure it.  
The action uses Drafts possibility to store [credentials](https://docs.getdrafts.com/docs/settings/credentials) to distinguish different spaces. When you duplicate the action for another space you have to change the name of the credential. Therefore you need edit this line `const spaceIdCredentialName = "CraftDocumentSpace"` in the script step of the action and change the `CraftDocumentSpace` to something different (e.g. describe the space in a suffix like „CraftDocumentSpacePersonal” or „CraftDocumentSpaceWork“. If you use several of my Craft actions you should use the same credential name in all of them.

## \[Usage\]

Use this action to create a cross-linked task / document between your task manager and Craft. If you e.g. took some notes during a meeting or while reading a book / blog in Drafts which you need to review or complete later – just run this action. It will help you to quickly navigate between the task and the document without seeing distracting other content.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1lZ)