---
title: Migrating Notes from Craft to Obsidian
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-10-27T17:58:41.000Z
metadata:
  categories:
    - obsidian
  tags:
    - craft
    - obsidian
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=489
  type: wordpress
  url: https://flohgro.com/obsidian/migrating-notes-from-craft-to-obsidian/
tags:
  - obsidian
---
**TL;DR What you need to do:**  
– export all documents  
– fix daily note links using regular expressions  
– create tags from tag documents (optional)  
– fix illegal characters in filenames, -paths and links

* * *

In my last post [A new Home for my Personal Notes](https://flohgro.com/obsidian/a-new-home-for-my-personal-notes/) I explained why I decided to move my notes from Craft to Obsidian. A few readers reached out to learn how I performed that switch.

In general I would recommend that you define a clear “cut“ between the two apps if you still want to use both. Additionally I think it‘s important to do the switch on one day to don‘t have overlapping and inconsistent usage of both apps because no system is working properly anymore. Choose a day when you have time to make the switch – depending on your skills and amount of notes this might take just 30 minutes or up to a few hours.

Since I‘m traveling right now and don‘t have access to my Mac I did everything on my iPhone – the process should be easier (and faster) when you use a Mac but basically you need to make the same adaptions.

These posts on [Reddit](https://www.reddit.com/r/CraftDocs/comments/y1sbqg/export_from_craft_to_obsidian/) and in the [Obsidian forum](https://forum.obsidian.md/t/import-from-craft-to-obsidian/19448) might be helpful for you, too.

The first step of course was to export the notes from Craft. To do so you can tap the three dots icon in the upper left corner. Select „Export (All Documents)“ and then „Markdown“ as shown in the screenshots below (actually the latest Craft Update changed something in that process since I was able to select the markdown format in the next prompt – do not use the Craft format there, I used the _GitHub/Notable/iA Writer_ option).

![](/assets/68F06555-B6A6-4A3E-AF4D-A260CF-J40ojoZrtaRx.png)

Depending on the amount of notes you have in Craft this might take a while (I think it was more than an hour for me). I stored the finished export locally on my iPhone and moved it to the Obsidian folder (On My iPhone/Obsidian). Of course you need to install the [Obsidian App](https://apps.apple.com/de/app/obsidian-connected-notes/id1557175442?l=en) first so that folder will appear. I strongly recommend to make a backup from that folder immediately (just duplicate and rename it). You can already launch the Obsidian App and choose to open the exported folder as vault in Obsidian but there several things in the documents that need adaption before they will be really useful in Obsidian.

The most obvious are the links to daily notes. Craft uses a specific format e.g. `[Tue 23. Aug](day://2022.08.23)` for these links. You definitely don‘t want to fix all of them manually but luckily we can use a regular expression for that – I always use [regex101](https://regex101.com) to develop and test regex.  
We can find all daily links in a file by using the following regex:  
`\[.*?\]\(day:\/\/(\d{4}).(\d{2}).(\d{2})\)`

To change the format we need to substitute it into the format we want to have the dates. I wanted to change all daily notes to use a format like „YYYY-MM-DD“. Since Craft exports the daily notes with dots instead of dashes this also would require to rename all the daily notes. For whatever reason I was not able to rename those files in Shortcuts with a „.md“ file extension at the end so I stick with „YYYY.MM.DD““ for now and will change it to my beloved format when I have access to my Mac again.  
The regex already includes so called „groups“ for the year, month and date that allow you to access them easily.  
To change the format to „YYYY-MM-DD“ you need to replace all matches of the regex with `[[$1-$2-$3]]`. If you do so, make sure to also rename all the files in the exported folder with this regex and substitution: `(\d{4}).(\d{2}).(\d{2})` with `$1-$2-$3`

If you also want to use Shortcuts for that purpose You‘ll find a link to the one I used at the end (including the other adaptions I made) but I‘d recommend to use the Mac for that with apps like [TextMate](https://github.com/textmate), [Sublime Text](https://www.sublimetext.com), [BBEdit](https://www.barebones.com/products/bbedit/) or most IDEs like [Visual Studio Code](https://code.visualstudio.com).

Now we already made a big step forward – all the links to Daily Notes should work again in Obsidian – maybe just check it by opening the graph view – you should see connections for the Daily Notes here:

![](/assets/CAC5CCB4-7174-499E-AA51-CF0381-7JyYF2w0ZWNW.png)

This was the easier part. Craft didn’t offer native tags that‘s why I used standalone documents and treated them as tags (by the way a great read about using tags, links, folders and so on: [All you need is links](https://subconscious.substack.com/p/all-you-need-is-links)). These documents all had the same format for their title `#[tagname]` and where stored in the same folder in my Craft space `[resources]/tags/`. The links to those documents didn‘t work properly for me and I also wanted to convert them to real tags in Obsidian. I needed to change all links to tag documents that looked like this `[[[resources]/tags/#[tagname]]]` to just the hashtags `#[tagname]`. Again a regex substitution helps us to do that substitution. Please note that you will need to adapt this to your own structure in Craft. If you created the tag documents similar than I did at least you need to change the path to the documents do match your structure in Craft. Again I used [regex101](https://regex101.com) to develop and test the regular expression for my needs. Just copy over a few different links to the editor of regex101 and build the regex.  
I did the substitution in two steps – first I removed the path to the tags (and also other documents in the `[resources]` folder) with this regex: `\[resources\]\/[a-z]*\/` and replaced it with an empty string. The (most) links to the documents in that folder should work without further adaption. One exception are illegal or unsupported characters in file-paths or -names. Which will be covered later.  
In my structure the links to „tag documents“ now looked like this `[[#[tagname]]]` but they don‘t work and also are not displayed as tags in Obsidian. To change this we need to remove the brackets – we can use a regex replacement again: When we replace `\[\[#(.*?)\]\]` with `#$1` in all files the links will be changed to tags recognized by Obsidian: `#[tagname]`. After that replacement you can open your vault and check the tags view – your tags should now appear here.

![](/assets/38B22B1B-537F-4F40-A673-CEDD60-Gl0NwGInVMGQ.png)

This is already a great starting point to explore your notes in Obsidian. I found out that quite a lot of links worked out of the box and didn‘t need adaption – even links to blocks inside of other notes from Craft seemed to work. I didn‘t go through all my documents to check all of them. Instead I‘m doing it iteratively now. When I open existing notes then I can always check if the links are still working – you can distinguish it easily by looking at the color of the link. If its displayed in a bright color then the link points to an existing document. If the color looks not bright that means the linked document couldn‘t be found be Obsidian. You can see the example in the following screenshot.

![](/assets/536E5B22-7197-488C-AA52-DBA87C-BG6oHpRgj5oR.png)

Now you have to search for the exact problem with the link. In almost all of the dead-end-links i found this was related to the file name which contained illegal characters for Obsidian. Files are (unfortunately)not allowed to contain `/`,`\` or `:`. If one of those characters is in the link then Obsidian will not find the correct file. You need to change the filename and adapt the link afterwards. I was not able to do this via Shortcuts since renaming and storing them as `.md` file didn‘t work on my iPhone. I would recommend to search for files with those characters in the finder or an other IDE to change all of them. This is only necessary if you have files with those characters. Since I imported highlights from articles I read I have a few files that mostly contain a `:`. If you don‘t have such files you shouldn’t have any problems.  
After fixing the filename and link, it should be displayed in a bright color.

![](/assets/73B6938C-4875-44B0-9E14-E067D7-a8MQGS3LtAVW.png)

The same problem can occur when you create new notes and want to link them to some of your old ones. If you type `[[]]`, search and select an exisitng note it might happen that Obsidian creates the link but it is again a dead-end. If that happens then make sure to check for illegal characters in the filename. Sometimes the path to the file (folder / subfolders) might also contain an illegal character.

This is the most frustrating part of the migration but maybe someone can point me to another possible solution that I can link here.

You can also check your Obsidian graph to see the recognized connections between notes and also check for orphan dots (notes) that you already linked in Craft. Just open the note by selecting the edge in your graph and check for the dead-end links in it.

A last and easy step is to reuse your templates that you created in Craft. The templates folder of Craft is also exported. You‘ll find all your templates in the `My Templates` folder in your vault. You can either keep the name or rename it depending on your preferences. I renamed mine to `templates` and pointed the Core Plugin for Templates to that folder.

![](/assets/F3127477-91F7-4A28-8989-C69455-RDcw5DWAoSdS.png)

Now I can use the templates I created for Craft in Obsidian. Some might need adaptions because not all stylings that are available in Craft are not supported by Obsidian. Just open the corresponding file and remove the styling markers. This especially affects highlight colors that are exported as `::highlighted text::`. You need to change the colons to equal signs in Obsidian: `==highlighted text==`

These are the steps I took to migrate from Craft to Obsidian. As mentioned I did the entire process on my iPhone since I don‘t have access to a Mac right now.

As I already mentioned I used a Shortcut to do those regex substitutions. You can download it [here](https://www.icloud.com/shortcuts/8c2733fcc3754a7baeed46108f8dcd7a) but you need to make some adaptions to it depending on your folder structure in the exported documents. You need to change the “Get contents of folder“ and “save file“ steps to use the folder of your Obsidian Vault (reminder: please make a backup before running this). You also have to change the path to the folder in the second text step manually (you can e.g. use the “Get Info“ option from the context menu of one of the files in your vault folder to find out that path.  
Use it of course at your own risk and the shortcut took more than 3h to complete for me to process all 700+ files in my export.

I hope this post helps you if you want to move from Craft to Obsidian – if you have questions or ideas to improve the process just let me know 🙌

If this post helped you to migrate from Craft to Obsidian you can support my work with a few coffees ☕️: [FlohGro Donate](https://flohgro.com/donate/). Appreciate the support!

In the next posts I‘ll share some automations that eases adding content to Obsidian from Drafts. You can also follow me on [Twitter](https://twitter.com/FlohGro) where I share these Actions earlier.