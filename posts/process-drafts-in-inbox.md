---
title: process Drafts in INBOX
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-02-28T09:03:31.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - drafts
  uuid: 11ty/import::wordpress::https://flohgro.com/web/?p=163
  type: wordpress
  url: https://flohgro.com/drafts-actions/process-drafts-in-inbox/
tags:
  - drafts-actions
  - drafts
---
This action can be used to quickly sort out your INBOX workspace.

The script will query your drafts from the defined workspace and ask you which of your action you want to run on the draft

The actions you want to run on the drafts in your inbox workspace are customizable.

The action was inspired by this post in the drafts forum: [TIP: Focus Your Inbox with an “Untagged”](https://forums.getdrafts.com/t/tip-focus-your-inbox-with-an-untagged-workspace/7282) which recommends to create a separate workspace which is your actual „inbox“. You can e.g. define a workspace which filters for untaggged drafts in your library.

The Action was published in this post in the forum: [Process Drafts in INBOX Action](https://forums.getdrafts.com/t/process-drafts-in-inbox-action/8536)

## \[Configuration\]

Before running the action you have to adapt the name of your „inbox“ workspace. Therefore you need to change the following line in the script step of the action: `let inboxWorkspaceName = "INBOX";` replace `INBOX` with the name of your inbox workspace (if you chose another one).

Next you need to change the actions you maybe want to run on the drafts in your inbox. To do so, you have to edit the `actionArray` in the script. By default this array looks like this:

```
let actionArray = [
  ['skip', ''],
  ['✅ Todoist inbox lines', 'INBOX line's'],
  ['🔗 Todoist URL Task', 'Draft URL Task'],
  ['🗂 Bookmark to DEVONthink', 'bookmark to DEVONthink'],
  ['⌨️ Markdown to DEVONthink', 'Markdown to DEVONthink CB'],
  ['🏷 add tags from category', 'add tag from category'],
  ['🗑 trash', 'trash']
];
```

Every element in the array (e.g. „`['🗑 trash', 'trash‘]`“) contains two strings. the first string e.g. `🗑 trash` defines how the action is displayed in the prompt. The second string e.g. `trash` contains the actual name of the action which shall be run.

To insert your own actions you can choose a name – how they should be displayed in the prompt and insert the action name in the second string. You can replace the existing ones by your own action or use the templates which are commented out `['', ''],` by removing the slashes in front of them and insert your own name and the action name between the quotation marks.

I recommend to keep the line `['skip', ''],` inside the action to enable you to skip a draft and don’t run an action on it.

## \[Usage\]

Drafts is my main INBOX for everything text related. Whether its a link from a webpage, a quick thought, a task or any other note I want to save. I want to stay Inbox Zero and that’s where this action speeds the things up a lot. I just run it and I can decide just with the title of the draft what needs to be done with it (e.g. push it to the todoist inbox, bookmark the link in DEVONthink and so on). The actions I select to run on the draft will actually be executed after the „process Drafts in INBOX“ action one after the other.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1ch)