---
title: Bookmark to DEVONthink
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-02-28T18:57:16.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - devonthink
    - devonthink-create
  uuid: 11ty/import::wordpress::https://flohgro.com/web/?p=302
  type: wordpress
  url: https://flohgro.com/drafts-actions/bookmark-to-devonthink/
tags:
  - drafts-actions
---
This action lets you add bookmarks to DEVONthink on the Mac / DEVONthink To Go on i(Pad)OS.

It will search the current draft for markdown formatted urls e.g.:

```
- [Google](www.gogle.com) this is famous search engine
- text before [Bear](bear://) and text after
- [text in brackets, no problem] [OneNote](onenote://open)
- [Google](www.gogle.com)
- [BBC](www.bbc.co.uk)
```

Depending on how many URLs are available in the draft the action will either

-   bookmark the only existing markdown URL to DEVONthink
-   display a prompt if multiple URLs are present in the draft – you can select by the given title which URL should be bookmarked.
-   the prompt will allow you to bookmark all available URLs in the draft to DEVONthink, too

The action automatically detects if you use this action on the Mac or an iOS device to ensure it calls the correct URL scheme for DEVONthink / DTTG

If you just want to open URLs check out the [open markdown URL](craftdocs://open?blockId=9D254797-5038-4AFC-8813-C767F607C4E6&spaceId=c8996997-f089-d91e-e6fc-4cd320a90625) action instead.

## \[Configuration\]

_no configuration needed_

## \[Usage\]

run this action whenever you want to bookmark a (markdown) URL from a draft to DEVONthink.

[GET THE ACTION](https://directory.getdrafts.com/a/18n)