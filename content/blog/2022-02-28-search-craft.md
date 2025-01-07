---
title: Search Craft
date: '2022-02-28T17:38:13.000Z'
tags:
- drafts-actions
- craft
---
With this action you can open the search in Craft prefilled with the content of the current draft in a configurable space

## \[Configuration\]

If you don’t wan’t to use the (any of my) action for different Craft spaces there is no configuration needed. When you first run any of my Craft actions it will ask you to store the space id of your Craft space. This is a one time action and you don’t need to do it for any other of my Craft actions you install.

To use these actions with different spaces you need to duplicate the action for each space you want to use it. I recommend to e.g. add a suffix to the action name to describe the space for which you configure it.  
The action uses Drafts possibility to store [credentials](https://docs.getdrafts.com/docs/settings/credentials) to distinguish different spaces. When you duplicate the action for another space you have to change the name of the credential. Therefore you need edit this line `const spaceIdCredentialName = "CraftDocumentSpace"` in the script step of the action and change the `CraftDocumentSpace` to something different (e.g. describe the space in a suffix like „CraftDocumentSpacePersonal” or „CraftDocumentSpaceWork“. If you use several of my Craft actions you should use the same credential name in all of them.

## \[Usage\]

Use this action to search for the content of the current draft in the configured space.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1jL)