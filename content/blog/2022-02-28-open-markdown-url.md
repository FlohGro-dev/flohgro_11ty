---
title: open markdown URL
date: '2022-02-28T06:48:06.000Z'
tags:
- drafts-actions
- drafts
---
This action will search the current draft for markdown formatted urls e.g.:

```
- [Google](www.gogle.com) this is famous search engine
- text before [Bear](bear://) and text after
- [text in brackets, no problem] [OneNote](onenote://open)
- [Google](www.gogle.com)
- [BBC](www.bbc.co.uk)
```

Depending on how many URLs are available in the draft the action will either

- open the only existing link immediately
- display a prompt if multiple URLs are present in the draft – you can select by the given title which URL should be opened.

The URLs are opened with Safari by default – this will also enable „app links“ e.g. „drafts://open..)

The action was inspired by [this thread](https://forums.getdrafts.com/t/i-can-t-seem-to-open-a-url-from-a-scrip/6980/16) in the forums – credits to @RoyRogers for the code examples – I used some of them in the action

## \[Configuration\]

_no configuration needed_

## \[Usage\]

run this action whenever you want to open a (markdown) URL from a draft. You don’t need to enter link mode in the editor – if only one link is present in the draft this action will speed up your workflow. You can even set a keyboard shortcut to the action or add it to your action bar if you frequently want to open URLs from your drafts.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/17E)