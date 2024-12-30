---
title: Drafts 46 - Automate!
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2024-12-12T17:49:24.000Z
metadata:
  categories:
    - drafts
  tags:
    - drafts
    - drafts-release
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=782
  type: wordpress
  url: https://flohgro.com/drafts/drafts-46-automate/
tags:
  - drafts
---
[Drafts](https://getdrafts.com) Version 46 was released today. In this post, I will highlight new features and my personal highlights of the release.

![](/assets/Thursday-12-Dec-2024-201012-Y0bAJGRP2SFo.png)

A few weeks ago I [dipped my toes](https://social.lol/@flohgro/113534112362382431) into [Syntax development](https://docs.getdrafts.com/docs/extending/development/syntax-format) for Drafts. I have no need to make big changes but I wanted to define some custom link definitions to e.g. run an action with `[[r:process INBOX]]`or open a tag filter with `[[t:project::active]]` – it is also published to the [directory](https://directory.getdrafts.com/s/2Vj) (and I maintain it in the respective [GitHub repository](https://github.com/FlohGro-dev/drafts-syntaxes)). When I added those link definitions I quickly noticed that the URL scheme that the [/search](https://docs.getdrafts.com/docs/automation/urlschemes#search) URL scheme did default to the inbox folder in Drafts. What I wanted was to directly jump to the _all_ folder to see every draft tagged with the given tag. After requesting the additional parameter it was added with this release and it works great. Now you can pass a folder parameter to force switching the folder tab in the draft list. E.g. `drafts://search?tag=project&folder=all` will filter the drafts list for all drafts tagged with _project_. I use this e.g. in my Weekly Review checklist together with the mentioned syntax it is easily possible to quickly filter for all drafts that are tagged with `project::active`. Another way I use this is to link to special searches from routine tasks in Todoist that open a specific predefined search.

While I don’t have a big personal use for it right now a new feature in Drafts 46 is Text-to-Speech. The described use case in the [forum](https://forums.getdrafts.com/t/drafts-46-released-text-to-speech-background-actions/15670/8?u=flohgro) e.g. as snippet library for often used phrases for verbally challenged users is an exceptionally great example. I appreciate that features like this are added to Drafts and extend its capabilities in ways I never thought about. If you want to find out more about this have a look at the [guide](https://docs.getdrafts.com/docs/editor/text-to-speech) which also includes some example actions that are ready to use to e.g. read the currently selected text.

My favorite new feature however is the new “Run Action in Background” shortcuts action.  
In fact, these are two new actions to either run a Drafts action on a given draft or on a provided text (which can be empty).  
This allows triggering Drafts’ actions from shortcuts without making Drafts the active app.  
A few months ago I found a (tacky) solution to [automate importing my Readwise highlights into Drafts](https://flohgro.com/automation/automating-readwise-highlights-import-into-drafts/). With this release, you can now create a scheduled automation that runs Drafts actions at a specific time of the day. Another example could be a tickler file action as discussed in [this](https://forums.getdrafts.com/t/is-it-possible-to-make-a-tickler-file-action/15578/5?u=flohgro) forum thread. The background execution has some restrictions. Actions that require user interactions (e.g. responding to a prompt) will not work – as stated in the [release notes](https://forums.getdrafts.com/t/drafts-46-released-text-to-speech-background-actions/15670#p-44685-background-actions-with-caveats-4?u=flohgro) Drafts will try to not display actions when you select the action in the Shortcuts editor but since evaluating this e.g. for scripted actions is not an easy task this is not bulletproof.  
If you have a use case I recommend just trying to run the Action from a Shortcut without setting up the automation first. Then double-check if you see the expected result in Drafts and set up the automation afterward. The potential for this feature is big! If you’re using Daily Notes you can let Drafts create that note daily (or weekly/monthly) in the background and once you open the app they will already be there. I will try to automate posting quotes to Mastodon with this feature.  
Of course, this is not only relevant for automation, this can also be used to run Drafts actions in other shortcuts.

Another solid release of Drafts – if you want to dive into the discussions of the new release head over to the announcement [in the forum](https://forums.getdrafts.com/t/drafts-46-released-text-to-speech-background-actions/15670?u=flohgro). I’m interested in your use cases for the new _Run Action in Background_ shortcuts action step – whether as automation or integrated into any other shortcut. Share them in the forum or send them over to me on [Mastodon](https://social.lol/@flohgro) or [Bluesky](https://bsky.app/profile/flohgro.bsky.social).