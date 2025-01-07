---
title: Raindrop Shortcuts
date: '2022-04-21T13:09:43.000Z'
tags:
- ios-shortcuts
- raindrop
---
Over the past weeks I used [Raindrop](raindro.io) to read and highlight articles. I build a Shortcuts to quickly retrieve the highlights of the latest document in my account and also a few ones to quickly add links via the Share Sheet.  
You can find the download links and descriptions below.  
All shortcuts require an API token for your account which you can create following these steps:

- go into the web app of Raindrop
- Navigate to the Settings
- Select Integrations
- Scroll to the bottom and click on the “For Developers” section
- create a new App
- generate the token you can paste into the Shortcuts

## import highlights

### latest Raindrop Highlights to Markdown

This Shortcut retrieves the raindrop highlights from the most recently highlighted document in Raindrop.  
The imported highlights are indented depending on the color in Raindrop to enable you to make structured highlights using different colors for different indentation levels in the markdown export. This makes it obsolete to reformat highlights in the exports after sharing them to your preferred app.  
The indentation level is created based on the colors in raindrop (from left to right):

- yellow: 0
- blue: 1 (=4 spaces)
- green: 2 (=8 spaces)
- red: 3 (=12 spaces)

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/257f09c1e64c4702b3571d51390872e3)

## create raindrops

### create raindrop (unsorted)

This shortcut adds the provided url to your Raindrop account in the “unsorted” folder

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/777c3955597a46e4b3f9b2d7551a3e12)

### create raindrop with predefined tags

This Shortcut creates a raindrop (bookmark) from a provided url in the “unsorted” folder of your Raindrop account with configurable predefined tags.

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/0ac3a9364e574e4b96bd2588da861b8e)

### create raindrop with tags from predefined options

This Shortcut creates a raindrop (bookmark) from a provided url in the “unsorted” folder of your Raindrop account with the tags you select. The options for the tags are configurable to your needs.

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/c6c1eeb090a8428ab7f0c242e30073c2)

### create raindrop in collection

This Shortcut allows to directly add a provided link to a collection in your Raindrop account. The Shortcut retrieves the collections from your account and you can choose in which one you want to add the provided link.

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/05a0169b311448f3a903ca40b8788117)

### create raindrop with predefined tags in collection

This Shortcut allows to directly add a provided link to a collection in your Raindrop account with predefined tags. The Shortcut retrieves the collections from your account and you can choose in which one you want to add the provided link.

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/380104e8a8d64239b47f06f555efc4f3)

### create raindrop with tags from predefined options in collection

This Shortcut allows to directly add a provided link to a collection in your Raindrop account with the tags you select. The Shortcut retrieves the collections from your account and you can choose in which one you want to add the provided link.

[GET THE SHORTCUT](https://www.icloud.com/shortcuts/f7c9c115fe8044d7a69b32ba14bbafd5)