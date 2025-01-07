---
title: extended drafts search
date: '2022-02-28T07:57:02.000Z'
tags:
- drafts-actions
- drafts
---
This actions gives you some options to search through your drafts library which are not possible with the standard search or the quick search view.

First you can search through your library by

- the title of the drafts
- the whole content of drafts

Additionally you can also search through all your drafts with a regex expression.

Last but not least you can search for a tag – select the tag you wanted and query for all drafts with that tag.

## \[Configuration\]

You can just use the action as it is. If you don’t need one of the search types you can modify this line `const searchTypes = ["in titles", "in content", "as regex", "in tags"];` and just remove e.g. „_“as regex”,_“ from the list.

## \[Usage\]

Just run the action anytime you want to search in you drafts library. It will display a prompt where you can type your query and then press the button to select the type of your search. If the resulting prompt shows the draft you searched for just select it and it will be opened. If you didn’t found what you searched for just „cancel“ the draft selection prompt and the action will ask you if you want to perform another search.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/11Y)