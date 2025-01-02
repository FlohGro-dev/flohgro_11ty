---
title: Launch Action
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-02-28T12:08:31.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - drafts
    - drafts-general
  uuid: 11ty/import::wordpress::https://flohgro.com/web/?p=185
  type: wordpress
  url: https://flohgro.com/drafts-actions/launch-action/
tags:
  - drafts-actions
  - drafts
---
This action can be used as a launcher of Actions from an ActionGroup in Drafts.

You can configure the action to always show the actions from one Action Group in a prompt – the selected action will be launched.

If you don’t specify an Action Group the action will first present a prompt where you have to select the Action Group and afterwards prompt for the Action you want to run.

## \[Configuration\]

To configure the action to use a specific Action Group you have to edit the „Define Template Step“ in the action. In the Text field „Template“ replace `undefined` with the name of the Action Group which shall be used by the action.

To let the action query for all Action Groups set it back to „undefined“.

If you want to use this action for several Action Groups, just duplicate it and configure the names of the Action Groups.

I recommend to add a suffix to the action name to identify the Action Group you configured.

## \[Usage\]

Use this Action to quickly launch an action from a specific Action Group or all your Action Groups.

You can assign it to a keyboard shortcut or add it to an action bar.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1nW)