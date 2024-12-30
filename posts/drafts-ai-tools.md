---
title: Drafts AI Tools
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2024-01-15T22:52:35.000Z
metadata:
  categories:
    - drafts
  tags:
    - drafts
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=663
  type: wordpress
  url: https://flohgro.com/drafts/drafts-ai-tools/
tags:
  - drafts
---
[Drafts](https://getdrafts.com) added scripting support for OpenAI’s ChatGPT already in [version 39](https://docs.getdrafts.com/changelog/#390) together with a [forum post](https://forums.getdrafts.com/t/using-openai-chatgpt-with-drafts/14221) which contains some example actions what you can do with it.

I was very excited about that because there are many use cases for AI within Drafts. Summarization, creation of ideas, spell-checking, translation or simply answering questions – you name it. I created a few actions using the scripting API for myself which were very useful for me. I wanted to enable more users without scripting knowledge to create their own actions to be used with this integration. It took me a while to figure out what could be a solution by being flexible enough at the same time.

I released the [AI Tools](https://directory.getdrafts.com/g/2PG) action group today. It contains a few ready-to-use actions and a template action to easily create actions for your own use cases.

![]({{ baseUrl }}/assets/CleanShot-2024-01-16-at-00.34.-1ZHIXUrqrp0q.png)

My idea was to create a template action that users can duplicate and then configure for their own purposes. The action has three important configuration options that define what “question” is sent to ChatGPT with the option to include “input text” that e.g. should be translated and of course tell the underlying script, what to do with the response text from ChatGPT. The configuration is done with the so-called “Define Template Tag” steps in the action. They contain the available options so you can easily choose what you want. The action group description in the Drafts directory contains detailed information, on what the different options mean.

![]({{ baseUrl }}/assets/CleanShot-2024-01-16-at-00.34.-MLSaMzpyokyx.png)

If you want to try the [AI Tools](https://directory.getdrafts.com/g/2PG) and create your own, just download the action group from the directory and make sure to read through the docs before using any of the actions or create your own.

I really hope that the AI Tools action group is helpful for you and enables users to create helpful AI-powered actions for themselves without the need to script on their own. I would be interested to hear what you enjoy, what you dislike, and most importantly what use cases you created for yourself. I would be happy to hear from you on [Mastodon](https://social.lol/@flohgro/111761185368113113).

Under the hood the action runs another action from the action group which is not visible in the list that contains the full script – if you’re interested you can have a look at the action by navigating into the “manage action groups panel” and look for the “AIToolBuilderScript” action. The code of the script is available on [GitHub](https://github.com/FlohGro-dev/drafts-actions/blob/main/aiToolBuilder.js), too.