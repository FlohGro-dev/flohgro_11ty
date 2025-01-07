---
title: crosslink Todoist project &#038; Craft document
date: '2022-02-28T18:47:12.000Z'
tags:
- drafts-actions
- craft
- todoist
---
This action will create a cross-linked project between Todoist and Craft.

The new project in Todoist will contain a link to the document in Craft and vice-versa.

The document in Craft will be created from a configurable template Draft.

Running the action will open a prompt asking you for the name of the project – this prompt will be prefilled with the current drafts content but you can set any name you like (the current draft will remain unchanged).

_known “issue”: if you quickly open the link to the Todoist project after the action prepended the link to the project to the Craft document, your Todoist app may show an error telling you that the project could not be found. The reason for this is, that Todoist needs to sync the created project to your app first. After the project was synced, the error won’t occur again._

## \[Configuration\]

You need to follow these steps until you can use the action.

**Define the project template draft**

The action **can** be configured to use a template for all your project documents (if you want that all of them have the same structure).

If you don’t want to use a project template draft (the created Craft document will be empty besides the link to the Todoist project). There is no need to change something after installing the action since the template usage is disabled by default.

If you want to use a template for the project document in Craft, create a new draft and give it a meaningful title (first line) and maybe add some tags to the draft to keep your library structured.

Then setup the template in Markdown format (note that the title (first line) of the template draft will not be pushed to the Craft document)

When you finished the template tap the „info“ button in the [editor](https://docs.getdrafts.com/editor/) and then tap the button titled „UUID“. This will copy the UUID of that draft.

Next, edit the script step of this action and change the variable in line 3 to `true`: `const templateDraftAvailable = true;`. Then find line 5 `const templateDraftUUID = "unconfigured“;` and select the word `unconfigured` and paste the UUID you just copied (attention: don’t delete the quotation marks).

If you don’t want to use the (any of my) action for different Craft spaces there is no further configuration needed. When you first run any of my Craft actions it will ask you to store the space id of your Craft space. This is a one time action and you don’t need to do it for any other oof my Craft actions you install.

To retrieve your spaceId just copy the deeplink of any document in that space (refer to the [Craft Support Page](https://support.craft.do/hc/en-us/articles/360020043878-How-to-link-into-a-specific-place-in-Craft-with-a-Deeplink) when you don’t know how to do that). Paste the copied id into a draft and you will se a link similar to this: “craftdocs://open?blockId=\[the block id\]&spaceId=\[the spaceId\]” – find the character combination “\[the spaceId\]” after the “spaceId=” and copy it and paste it into the prompt of this action.

To use these actions with different spaces you need to duplicate the action for each space you want to use it. I recommend to e.g. add a suffix to the action name to describe the space for which you configure it.  
The action uses Drafts possibility to store [credentials](https://docs.getdrafts.com/docs/settings/credentials) to distinguish different spaces. When you duplicate the action for another space you have to change the name of the credential. Therefore you need edit this line `const spaceIdCredentialName = "CraftDocumentSpace"` in the script step of the action and change the `CraftDocumentSpace` to something different (e.g. describe the space in a suffix like „CraftDocumentSpacePersonal” or „CraftDocumentSpaceWork“. If you use several of my Craft actions you should use the same credential name in all of them.

## \[Usage\]

After you configured the action properly – just run it when you want to setup a new project from whatever draft you currently opened.

The prompt will appear and you can use either the content of the current draft as the project name or just type a new name.

The action will then create the project in Todoist, retrieve its id and create a new craft document (eventually with your configured template) and link that project in the document. Then the action will create an uncompletable task in the new Todoist project containing a clickable link to the project document in Craft.

_note: the Craft document will actually contain two links to Todoist. The name of the project will be a link which can be used on mobile (iOS / iPadOS) to directly open the project in the Todoist app. the „Webview“ link is necessary for macOS since the mobile url is not working properly on the Mac._

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1sk)