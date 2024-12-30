---
title: Create Craft Note
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-02-28T17:41:00.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - craft
    - craft-general
  uuid: 11ty/import::wordpress::https://flohgro.com/web/?p=229
  type: wordpress
  url: https://flohgro.com/drafts-actions/create-craft-note/
tags:
  - drafts-actions
---
This action creates a new Document in Craft in a configurable space.

## \[Configuration\]

If you don’t want to use the (any of my) action for different Craft spaces there is no configuration needed. When you first run any of my Craft actions it will ask you to store the space id of your Craft space. This is a one time action and you don’t need to do it for any other of my Craft actions you install.

To retrieve your spaceId just copy the deeplink of any document in that space (refer to the [Craft Support Page](https://support.craft.do/hc/en-us/articles/360020043878-How-to-link-into-a-specific-place-in-Craft-with-a-Deeplink) when you don’t know how to do that). Paste the copied id into a draft and you will se a link similar to this: “craftdocs://open?blockId=\[the block id\]&spaceId=\[the spaceId\]” – find the character combination “\[the spaceId\]” after the “spaceId=” and copy it and paste it into the prompt of this action.

To use these actions with different spaces you need to duplicate the action for each space you want to use it. I recommend to e.g. add a suffix to the action name to describe the space for which you configure it.  
The action uses Drafts possibility to store [credentials](https://docs.getdrafts.com/docs/settings/credentials) to distinguish different spaces. When you duplicate the action for another space you have to change the name of the credential. Therefore you need edit this line `const spaceIdCredentialName = "CraftDocumentSpace"` in the script step of the action and change the `CraftDocumentSpace` to something different (e.g. describe the space in a suffix like „CraftDocumentSpacePersonal” or „CraftDocumentSpaceWork“. If you use several of my Craft actions you should use the same credential name in all of them.

## \[Usage\]

When you made notes during a meeting or while reading something and you decide to move the notes to Craft, simply run this action and it will create and open the new document in Craft. The markdown formatting will not be changed and applied to each created block in Craft.

If you want to use the actions for different spaces in Craft just follow the instructions above.

[GET THE ACTION](https://directory.getdrafts.com/a/1g1)