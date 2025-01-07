---
title: combine drafts from workspace
date: '2022-03-15T09:37:07.000Z'
tags:
- drafts-actions
- drafts
---
This action combines drafts from a workspace into a single draft.  
This action was inspired by [this post](https://forums.getdrafts.com/t/prepend-timestamp-to-multiple-drafts-and-merge/12298) in the Drafts Forum.

The resulting draft will contain the content of all drafts in a bullet list with the creation time as a prefix:

```
# Drafts from 2022-03-15

- 08:00: some content of a draft
- 08:30: maybe some other draft which was dictated
- 09:01: and another draft
```

## \[Configuration\]

- edit the script step of this action and change the variable `workspaceName` to the name of the workspace you want to use this action with
- if you want change the variable `draftTitle` to change the title of the resulting draft

## \[Usage\]

The use case in the forums post was to combine all drafts from a workspace e.g. today into a single draft.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1x4)