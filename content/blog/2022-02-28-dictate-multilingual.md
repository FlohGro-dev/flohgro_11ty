---
title: dictate multilingual
date: '2022-02-28T12:04:45.000Z'
tags:
- drafts-actions
- drafts
---
This action allows to start dictating for different languages. This is really useful if you e.g. want to dictate in your native language and sometimes in english.

If you run the action it will provide a prompt with different languages to select from. When you selected a language the dictation interface of Drafts will be displayed for the chosen language and you can start dictating a new draft.

The offered languages are customizable to your needs.

## \[Configuration\]

To configure the offered languages you need to edit the script step of this action.

Just open the script in edit mode and search for the array „`locales`“ which starts at line 4.

If you want to disable a language (so it is not displayed in the prompt) just comment out that line by adding two forward slashes („`//`“) at the beginning of that line.

To e.g. just display english or german in the prompt, the array should look like this:

```
const locales = [
["German", "de"],
// ["German (Germany)", "de_DE"],
["English (US)", "en_US"],
// ["Spanish", "es"],
// ["Spanish (Mexico)", "es_MX"],
// ["Frensh", "fr"],
// ["Italian", "it"],
// ["Croatian", "hr"],
// ["Serbian", "sr"],
// ["Hungarian", "hu"],
// ["Swedish", "sv"],
// ["Greek (Greece)", "el_GR"],
// ["Dutch", "nl"],
// ["Swiss German", "gsw"],
// ["Portugese", "pt"],
// ["Czech", "cs"],
// ["Icelandic", "is"],
// ["Turkish", "tr"],
// ["Danish", "da"],
// ["Chinese", "zh"],
// ["Japanese", "ja"],
// ["Ukrainian", "uk"],
// ["Polish", "pl"],
// ["Russian", "ru"],
]
```

If you can’t find your language (or your variation) in the array, you can e.g. look into this [file on gist](https://gist.github.com/jacobbubu/1836273). If you want to add a new language, just replace an existing one, or add a new element into the array

## \[Usage\]

Just run this action whenever you want to dictate a note to Drafts. You can add a keyboard shortcut to speed this up or e.g. add this action to a Drafts Widget on your homescreen.

➡️ [GET THE ACTION](https://directory.getdrafts.com/a/1lJ)