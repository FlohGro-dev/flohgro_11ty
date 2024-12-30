---
title: Add to List
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-02-28T12:03:51.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - drafts
    - drafts-lists
  uuid: 11ty/import::wordpress::https://flohgro.com/web/?p=197
  type: wordpress
  url: https://flohgro.com/drafts-actions/add-to-list/
tags:
  - drafts-actions
---
This action adds the content of the current draft to the list draft you select in a prompt. The content will be added after a checkbox. You can also create a list for a new topic from the prompt.

## \[Configuration\]

You need to configure the tag this action should use. To do so, edit this line in the script `const listTag = "ref_list";` and replace _ref\_lists_ with the tag you want to use for your lists.

## \[Usage\]

After you configured the action you can add the content of the current open draft to one of your lists. If you want to create a new list for a topic just select _CREATE NEW LIST_ and insert the name for the list. The action will automatically create the new list and add the content to it.

To quickly open one of your lists check out the [Show List](https://flohgro.com/web/drafts-actions/show-list/) action

[GET THE ACTION](https://directory.getdrafts.com/a/1Vz)