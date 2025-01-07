---
title: Prepend to Craft Note with Date with new line after Date
date: '2022-02-28T18:38:34.000Z'
tags:
- drafts-actions
- craft
---
modification of the default „Prepend to Craft Note with Date“ action due to request in [Drafts Forum](https://forums.getdrafts.com/t/append-to-craft-note-with-date-breaks-the-markdown-import-of-the-first-line-of-a-note/11957)

This action prepends the content of the current draft to a selectable document in one of your Craft spaces. The current date and a newline will be prefixed before the content.

You can configure the documents which should be selectable in the prompt very easily.

Follow the instructions to configure the action before you use it.

## \[Configuration\]

the first time you run the action, it will create a new draft titled “Append / Prepend to Craft Action Configuration”. Think of this draft as the engine or library behind the Draft Action. (You can tag and archive this draft in the Drafts after configuration to hide it in your day to day work.)

Now you can configure to which Craft documents the action can append/prepend:

- Open the Document / Page you want to add to the Menu of this action in the Craft app.
- click the three dots in the upper right corner and select “Share & Export”, scroll down and click “Copy Markdown Deeplink”
- In Drafts, open the draft “Append / Prepend to Craft Action Configuration” and paste that Markdown Deeplink into it (I’d recommend a bullet list for each page / document, however **it’s absolutely necessary to have a new line for each item** which should appear in the menu).
- Repeat this for each Craft document / page you are likely to append/prepend content to
- To test your set up, create a new Draft and run the Append / Prepend action. You should see a menu of the Craft documents in your configuration. Select the Craft document to append/prepend the content and that’s it!
- note: if you want to add contents to a block you should create this block as a subpage or add content into it in Craft first to make sure that this works

Here is a small example to illustrate how a configuration Draft could look like:

```
# Append / Prepend to Craft Action Configuration

- [MOVIE LIST](craftdocs://open?blockId=[a-complex-blockId]&spaceId=[the-complex-spaceId-from the block])
- [BOOK LIST](craftdocs://open?blockId=[another-complex-blockId]&spaceId=[the-complex-spaceId-from the block])
```

This action will also work for documents in different spaces.

#### ADDITIONAL NOTES

There are several actions to prepend / append contents to Craft documents in the action directory. All of these actions share the same configuration draft titled “Append / Prepend to Craft Action Configuration”

You can find all related actions to append / prepend content to documents with the tag: [craft-add-to-document](https://flohgro.com/tag/craft-add-to-document/)

If you want to have different destinations in craft for those actions or e.g. want to have separate personal and work configuration drafts you can edit the line `const configurationDraftTitle = "Append / Prepend to Craft Action Configuration"` in the script step and change the title there.

## \[Usage\]

This action supports you for many different use cases. You can e.g. append / prepend notes and thoughts to a list of gift ideas, a list of places you want to visit or a list of things you are grateful for. You can also create a document in Craft for regular meetings you have and add things you want to mention in the meetings to this document by using this action.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1ts)