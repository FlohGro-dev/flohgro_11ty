---
title: Craft Document From Template
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-02-28T18:13:02.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - craft
    - craft-templates
  uuid: 11ty/import::wordpress::https://flohgro.com/web/?p=245
  type: wordpress
  url: https://flohgro.com/drafts-actions/craft-document-from-template/
tags:
  - drafts-actions
  - craft
---
This action creates documents in Craft from templates stored in Drafts.

You can setup as many templates as you want. They are identified from the action by one or more configurable tags you apply to the template drafts. The action also supports you to easily create new templates with your configured tags.

The action will query for all drafts with the configured tag(s) (its optionally possible to configure tags which shall be omitted). A prompt will be displayed where you can select the template you want to use.

After selecting a template the action will create and open the new document in Craft.

If you want to add a template to your Daily Note – use the [add Daily Note Template to Craft Daily Note](https://flohgro.com/web/drafts-actions/add-daily-note-template-to-craft-daily-note/) action instead.

## \[Configuration\]

Before you can use the action you have to configure it to your needs as follows.

- **template tags:** you have to configure the tags which your templates should include (the action will only display these drafts in the menu)
- therefore you have to edit the script step of the action
- in line 4 `const templateTags = ["3 template", "3 sw craft"];` you will see the constant „templateTags“
    - this constant defines the tags which identify your craft template drafts. Please add them as comma-separated-strings into the array.
    - feel free to delete the standard configuration of `"3 template", "3 sw craft"`
    - make sure to at at least one tag into the array
- _\[optional\]_ **template omit tags:** you can configure tags which should not be included in the drafts found by this action
- e.g. you have configured your templateTags to “3 template”, “3 sw craft“, but you have other drafts with the tag „todo“ which should be ignored by this action
- add these tags into the empty array of the constant „templateOmitTags“ in line 7 `const templateOmitTags = [];` and the corresponding drafts containing this tag will be ignored by this action

When you first run any of my Craft actions requiring the space id it will ask you to store the space id of your Craft space. This is a one time action and you don’t need to do it for any other of my Craft actions you install.

To retrieve your spaceId just copy the deeplink of any document in that space (refer to the [Craft Support Page](https://support.craft.do/hc/en-us/articles/360020043878-How-to-link-into-a-specific-place-in-Craft-with-a-Deeplink) when you don’t know how to do that). Paste the copied id into a draft and you will se a link similar to this: “craftdocs://open?blockId=\[the block id\]&spaceId=\[the spaceId\]” – find the character combination “\[the spaceId\]” after the “spaceId=” and copy it and paste it into the prompt of this action.

If you don’t wan’t to use the (any of my) action for different Craft spaces there is no further configuration needed.

To use these actions with different spaces you need to duplicate the action for each space you want to use it. I recommend to e.g. add a suffix to the action name to describe the space for which you configure it.  
The action uses Drafts possibility to store [credentials](https://docs.getdrafts.com/docs/settings/credentials) to distinguish different spaces. When you duplicate the action for another space you have to change the name of the credential. Therefore you need edit this line `const spaceIdCredentialName = "CraftDocumentSpace"` in the script step of the action and change the `CraftDocumentSpace` to something different (e.g. describe the space in a suffix like „CraftDocumentSpacePersonal” or „CraftDocumentSpaceWork“. If you use several of my Craft actions you should use the same credential name in all of them.

## \[Usage\]

### Setting up templates

When you finished the \[Configuration\] you can start setting up your templates. If you already have drafts with the configured tags they will directly show up in the prompt of the action.

If you don’t have any draft with the configured tag(s), the prompt will just display a button “\[Create New Template\]” when you select that button, Drafts will create a new Draft with the configured tags and a default content.

Replace the title with the name of your template (which will be the title of the created Craft Document) and just insert the content you want to have in that template in markdown format

Setup as many templates as you want

### Creating Documents from Templates

When you configured the action and set up one or more templates the action can be used very easily.

When you run it the prompt will display the titles of all drafts with the configured tags, just select the template you want to use and the action will create and directly open the new document in Craft.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1re)