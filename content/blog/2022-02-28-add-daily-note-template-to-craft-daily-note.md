---
title: add Daily Note Template to Craft Daily Note
date: '2022-02-28T18:13:33.000Z'
tags:
- drafts-actions
- craft-templates
- craft
---
This action is designed to add a template to the body of todays Daily Note in Craft

You can create and modify the template in Drafts and run the action daily to have the same template in your Daily Note every day.

The URL Scheme of Craft currently can’t directly add content to a Daily Note. Therefore this action requires the shortcut [Add (Text-Input) to Todays Note](https://flohgro.com/web/ios-shortcuts/add-text-input-to-todays-note/) to be installed on your device.

If you want to create documents based on templates – use the [Craft Document From Template](https://flohgro.com/web/drafts-actions/craft-document-from-template/) action instead.

Before you can use this action you have to configure it with your Daily Note template (and set this up if you don’t have one)

## \[Configuration\]

To configure this action correctly you need to do two things:

- setup a template draft
- insert the UUID of the template draft into this action

#### Setup of the Template Draft

You can use any draft as your Daily Note template. It is important to know that the action will just use the **body** of the template draft and ignore the first line (title). Therefore you can use a header for the draft like “# Craft Daily Note Template” which you won’t see in every Daily Note in Craft.

You can also insert Links to other Craft Notes in the Template and they will be directly linked in Craft – this is really useful if you e.g. have a “Gratitude“ document and also want to note things you are grateful for in your Daily Notes – then the Daily Note will be linked to your “normal” Gratitude Note. To insert links to other Craft documents, just copy their markdown deeplink into the template draft.

If you already have a Template for your Daily Note in Craft you can simply export it as Markdown to Drafts. Remember to set a header for that draft afterwards.

An example template is shown below:

```
# Craft Daily Note Template
## Today Bible Reading

- notes

## [Gratitude](craftdocs://open?blockId=<>&spaceId=<>)

- notes

## Daily Notes

- notes
```

#### Insert the UUID into the Action

To tell the action which draft is your template, simply copy the UUID of the template Draft. The UUID can be copied in the info-menu of the Template Draft (refer to Drafts documentation [Editor Docs for Reference](https://docs.getdrafts.com/editor/))

When you copied the UUID edit this action and navigate into the first step which is a “`Define Template Tag`” step.

There simply replace the “`UUID_OF_THE_TEMPLATE_DRAFT`” with the UUID you just copied from the template draft.

## \[Usage\]

If you finished the configuration you can run the action with any draft open in the editor – the currently open draft won’t be modified.

The action will load search for the template and then open the Shortcuts app to appended the template to your Daily Note.

**Bonus Tip:**

If you want to include running this action into something like a „morning routine task“ just use the following link and include it in that task description / as subtask. Opening that link will immediately run the action:

`drafts5://x-callback-url/runAction?text=&action=add%20Daily%20Note%20Template%20to%20Craft%20Daily%20Note`

### Known Issues

- if you create your daily note on one of your devices (e.g. your iPhone) and Craft did not sync on another device (e.g. your iPad) and you run the action again, you will see two daily notes next to each other. This is a known issue at Craft → don’t run the action on two different devices on the same day (which does not make sense anyways)

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1ri)