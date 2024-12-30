---
title: Draftodon &#8211; a Drafts Action Group for Mastodon
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2023-02-14T20:19:11.000Z
metadata:
  categories:
    - drafts
  tags:
    - drafts
    - mastodon
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=616
  type: wordpress
  url: https://flohgro.com/drafts/draftodon-a-drafts-action-group-for-mastodon/
tags:
  - drafts
---
Along with many others I significantly reduced my usage of Twitter recently and switchted my activities to the shiny “new” Mastodon. You can find me at [@FlohGro](https://social.lol/@flohgro) on [social.lol](https://social.lol) if you want to follow me.

I was using a few Actions for Twitter in Drafts that I immideatly missed after I made the move to the Fediverse. After downloading some Actions from Drafts Action Directory I couldn’t resist to think about combining all of them to an easy to use Action Group with even more features than all the current Actions.

So I started developing and after hours (I didn’t count them) of work I was happy to release `Draftodon` an Action Group dedicated to integrate Drafts with Mastodon.

![](/assets/Tuesday-14-Feb-2023-221648-fxpHqKT0KQOC.png)

The Action Group has an easy setup procedure (you need to download the underlying `Draftodon.js` file with an Action and configure your mastodon instance and user handle in the `Draftodon Settings` Action) so hopefully anybody can use it.

After doing the setup Draftodon enables you to post or schedule posts, polls and posts with content warnings. You can also publish threads if you want to write more than the character limit allows. I didn’t stop there and also implemented Actions that allow you to view and edit scheduled posts (delete / change the schedule). I also included some useful helpers to insert often used hashtags or handles of users you want to mention regularly in your posts.

After some initial problems for early adopters (my bad – in case you’re interested: I directly linked the `Draftodon` Action in my Action Group which is not working for shared Action Groups – there you have to use the Template string in the “Include Action” step) I already released a small update to Draftodon to allow configuration of post visibilities to address a user request.

Draftodon relies on a JavaScript file that you install with the `Draftodon Setup / Update` Action, which stores the file in the Drafts folder of your iCloud Drive directory in the subpath /Library/Scripts. The `Draftodon.js` is versioned in the corresponding [Draftodon GitHub repository](https://github.com/FlohGro-dev/Draftodon) which allows me to push bugfixes and small updates to functions without the need of updating the whole Action Group.

I really enjoy working on that Action Group so if you have any further requests, questions or issues with it – please reach out to me on [Mastodon](https://social.lol/@flohgro)

If you’re not yet using Draftodon but want to check it out – start by downloading the Action Group and read through the instruction to set everything up

[Get Draftodon](https://directory.getdrafts.com/g/2GL)

I hope Draftodon is a helpful tool for you and speeds up many of your workflows and processes.

Whats next? I have a few requests that I’ll be working on:

-   integrate an Action that allows you to reply to other posts (refer to [this action](https://directory.getdrafts.com/a/2GG))
-   cover issues with authentication (sometimes Drafts is not authenticated properly but a credential will be creadet which needs a manual reset)
-   improve parts of the documentation (more prominently mention that the template tag names must not be changed)
-   find an easy solution to use Draftodon with mulitple accounts

If you like the Action Group I would appreciate if you share that you’re using it on Mastodon, boost my posts about it (e.g. launch of [Draftodon 1.1](https://social.lol/@flohgro/109857674459597077)) and consider to support my work by [donating](https://flohgro.com/donate)