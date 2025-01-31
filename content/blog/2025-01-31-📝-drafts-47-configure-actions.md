---
title: 📝 Drafts 47 - Configure Actions
date: 2025-01-31T22:05:04.213+01:00
tags: ["drafts-release","drafts"]
permalink: /blog/📝-drafts-47-configure-actions/index.html
---

[Drafts](https://getdrafts.com) Version 47 was released a few days ago. In this post, I will write about my personal highlights of the release.

![Screenshot of the release notes interface in Drafts 47 explaining the new features.]({{ baseUrl }}/assets/drafts-47-release-notes.jpeg)

## Action Configuration

This new version (finally) adds a feature I first requested in October 2022  - and this is not to say that it was something urgent or that I was begging to get it. It is a convenient feature for users and developers of actions that share them in the directory. 

Many actions require user-specific configurations like a username, a hostname, specific tags, ... you name it. Until now we (people who share actions on the directory) used the `Define Template Tag` action steps to let users put in their settings. This has a few drawbacks:

- It is complicated to explain for inexperienced users
- You need to handle unconfigured values in the script
- It is relatively easy to accidentally publish personal information if you're testing or updating existing actions
- documentation of what has to be configured for the different Define Template Tag action steps needs to be done in the action description

Thanks to this new release this is now a thing of the past. Drafts 47 introduces **Action Configuration**. The new action step `Configured Value` is introduced that solves most of these issues. I won't go into too much detail since there is a full-blown documentation available [here](https://docs.getdrafts.com/docs/actions/configuration). In short, this allows an action developer to define a value that another user needs to configure and the action will ask the user on the first run to add the configuration. Additionally, a user can reconfigure these values later by opening the context menu of an action and selecting "Configure". The developer can provide default and example values for it and most importantly the own configuration will not be published to the directory once an action is shared.

I was already building an action that allows me to run configurable actions from another action group selected in a prompt. In this action, I immediately made use of this feature which is really great. I can give more instructions to the user on what this `Configured Value` is all about so it is much easier to use. Download the [action runner](https://directory.getdrafts.com/a/2XF) and give it a try.

![]({{ baseUrl }}/assets/drafts-47-configure-action-example.jpeg)

A few things need to be refined or you need to be aware of when you use this new step.

- Running the action the first time will open the great new interface to configure the values but it will not run the action after saving the values (it is mentioned in the description of the displayed prompt but I don't think every user will read it)
- It is still possible to not configure any value for a variable that needs user input so you still have to handle unconfigured values in the action (I think this will stay as it is - it is not a big deal and there might be other cases where it is intended to have empty values)
- If a value is not required for initial configuration the prompt will not show this automatically - you can add something like "(optional)" into the name of the `Configured Value` to simplify the user input with them - the setting is only used to determine if the configuration prompt should appear automatically or not
- For action groups that share settings between actions like [Draftodon](https://directory.getdrafts.com/g/2GL) or [Draftist](https://directory.getdrafts.com/g/1wK) you have to load the configured values of a settings action via scripted access as [documented](https://docs.getdrafts.com/docs/actions/configuration#using-configured-values-in-scripts). This is not an issue for those big action groups since they only use script steps anyways. 

## Shortcuts Scripting

We also got a new scripting object that simplifies running Apple Shortcuts from a script and (optionally) retrieve and use the result.

Running shortcuts from Drafts is nothing new, it was always possible to call the [Callback URL scheme](https://support.apple.com/guide/shortcuts/run-a-shortcut-from-a-url-apd624386f42/ios) of a shortcut or use the `Run Shortcut` action step. Drafts 47 introduces a new [Shortcut class](https://scripting.getdrafts.com/classes/Shortcut) to conveniently run Shortcuts via their URL scheme.

While I don't run a lot of shortcuts from Drafts this might change this for certain use cases. Since I [moved my blog to 11ty](https://flohgro.com/blog/say-hello-to-11ty-🚀/) I already have a new use-case for this and the scripting access made it easy to retrieve the result. I use a git repository to store my blog content and while I use the API to post text-only content I rely on [Working Copy](https://workingcopy.app) as a git client on iOS to add images to the repository and publish posts with those images. With a few lines, I can now trigger a small shortcut that commits and pushes all the changes to the repository. If something goes wrong I will be notified and can open the Working Copy and fix the error there.

If you're interested in how I built that, let me know. If you want to give it a try, have a look at the [scripting reference of the shortcut class](https://scripting.getdrafts.com/classes/Shortcut) for details.

## Other Changes

Prompts now support visual dividers to group different sections in a prompt. The following screenshot from my [fantastic event parser](https://directory.getdrafts.com/a/2Og) action now includes two separator lines to visually group the date settings for the created event.

![]({{ baseUrl }}/assets/drafts-47-prompt-divider.jpeg)

Additionally, you can now create prompts with fields that only accept numeric values as input.

Besides the usual bug fixes Drafts 47 now removes the TextExpander iOS SDK support but I never used it and therefore have no idea how hard this is for users who still use the discontinued app on iOS.

## Closing
 
As always this is another solid release with great additions to Drafts - if you want to join the discussion about this new release or have a look at the full release notes - have a look into [the forum](https://forums.getdrafts.com/t/drafts-47-released-action-configuration-shortcuts-scripting/15770?u=flohgro). I'm especially interested in how you think about the new **Action Confinguration** feature from a user perspective. Let me (and more importantly [Greg](https://mastodon.social/@agiletortoise)) know how useful it is for you and what improvements you'd like to see.