---
title: Draftist &#8211; a Drafts Action Group for Todoist
authors:
  - name: flohgro
    url: http://flohgro.com/web
    avatarUrl: >-
      https://secure.gravatar.com/avatar/13f4ea13d20fe190e1c4b4324daec918?s=96&d=mm&r=g
date: 2022-05-17T09:16:05.000Z
metadata:
  categories:
    - drafts-actions
  tags:
    - drafts
    - todoist
    - todoist-create
    - todoist-crosslink
  uuid: 11ty/import::wordpress::https://flohgro.com/?p=430
  type: wordpress
  url: >-
    https://flohgro.com/drafts-actions/draftist-a-drafts-action-group-for-todoist/
tags:
  - drafts-actions
---
Finally I can launch a project I wanted to do for quite a while. After a few months of work I’m happy to release **Draftist – a Drafts Action Group for integrating Drafts with Todoist**.

## A bit of background

Drafts is one of my most used App on all devices. If I had to pick a favorite app it would be a hard pick between Drafts, Craft and Todoist – luckily I don’t need to 😉

Drafts made it easy to quickly throw tasks into Todoist without actually opening it which 1) speeds up adding tasks and 2) removed friction since I don’t see anything else but a blank draft when I quickly add tasks.

I digged deeper into the rabbit hole of automating Todoist with Drafts early to e.g. simply switch labels of tasks or resolve waiting4 items by using the Scripting API of Drafts for Todoist.

While this was really helpful for myself it always was a bit _hacky_ and put together with a lot of duck tape. This was working fine but what bothered me was that I could not share this with other users since it simply was too complicated to configure and maintain. Additionally I did not document the Actions I built for myself very well which only complicated sharing possibilities.

Therefore I never shared more complex automations for Todoist with Drafts in the past.

Earlier this year I decided I want to change this and after the success of Craftist it was only a matter of finding time to built an Action Group for Todoist from the ground up.

After a few months of work I finally released the first version.

## What is Draftist

Draftist is an Action Group you can download from the action directory of Drafts to install it in your Drafts application.

It contains a bunch of Actions to integrate Drafts with Todoist – starting from very basic ones to quickly add tasks to your account (with or without settings) to very complex ones like importing of tasks or modifying labels or due dates.

Since everyone uses Todoist differently I wanted to develop Draftist very flexible to adapt to everyone’s needs by both – keeping it simple to configure and easy to use at the same time.

I also wanted to make sure I can imorove or add features and fix issues easily. Which is why I created Draftist as a single source file which contains all the necessary functions which is loaded in all the Actions. The `Draftist.js` file is maintained in the public [GitHub repository of Draftist](https://github.com/FlohGro-dev/Draftist) and downloaded by the `Draftist Setup/Update` Action into the Drafts directory in iCloud Drive.

Using a single source file and building Actions from those functions allows two things:

1.  Actions can be duplicated and configured differently very easily
2.  Experienced Scripting users can actually use the functions I implemented to create extended workflows for their own by just including the `Draftist` Action into theirs.

Since Draftist is interacting with the Todoist API and some of the Actions load your project / label names to create tasks in projects or assign labels the Actions require an internet connection. I wanted to prevent endless loading times when users often create Tasks with settings and therefore came up with the solution to store the data of labels, projects and sections (but thats for later) in a file in your iCloud Drive. This is updated once a day by default but you can configure this to be faster or slower. This (massively) speeds up the process and also reduces the amounts of requests Draftist makes to the Todoist API. To ensure the user is always in control you can force a sync of the Todoist data with the `update local Todoist data` Action (if a user created a new project and wants to immideately use it with Draftist).

The user defined settings are also stored in a file in your iCloud Drive directory. A nice benefit of this is that the settings (and Todoist data) are synced between your devices via iCloud and users don’t need to do anything about this.

## What can I do with Draftist

Draftist intends to simplify your repeating workflows and remove frictions from processes.

This starts with a couple of Actions to easily create tasks from a Draft in Todoist. You can quickly note or brainstorm tasks into a Draft and then run an Action to e.g. create a new task for each line in the current draft (either using Todoist quick add syntax or manually selecting the settings for the tasks from prompts).

Next you can import Tasks into the current Draft – this is possible for simple things like importing the todays tasks, or tasks from a project to more complicated user defined filters.

I also built a few more complex Actions which let you modify existing tasks. You can update the labels or due dates of tasks you select (Draftist shows the options from a filter in a prompt), resolve or delete tasks and one thing I constantly use is to duplicate tasks with switching a label (e.g. from @waiting4 to @followUP).

Several Actions in Draftist seem to be duplicates but this is actually intended. Some Actions just present a prompt where you can e.g. type in the tasks you have in mind and send them to Todoist (without creating a new Draft at all) and others allow you to predefined things like a filter which should be used by the action to e.g. always present you the tasks from the filter “today” in a prompt to select tasks.

The nice thing is, that you can duplicate and rename those Actions without breaking anything and use it with different configurations.

I recommend you to create your own (blank) Action Group e.g. named “my Draftist” and use the `Draftist Action Replicator` Action to duplicate the Actions you want into your own Draftist Action Group. There you can then configure and rename them to your preference and the original Draftist Action Group remains untouched.

I know the setup might seem a bit tricky but really thats the most simple setup I could imagine. To help users remove the initial barriers I plan to record some videos to show you how to setup Draftist and also how to configure and use the Actions. If you have specific usecases which you would like to see or struggle with the setup – please [let me know](https://flohgro.com/contactme).

## What are the future plans for Draftist

This is only the first step for Draftist and I have a few other ideas I can implement for users. I want to support even more specific usecases and probably also integrating / crosslinking with other Third Party apps. I’m also thinking about Actions to create projects / sections.

I would love to hear your needs which hopefully can be replicated with Draftist. Again – just let me know what you’re up to.

I hope that Draftist simplyfies and speeds up many of your workflows and helps to remove friction from your processes.

Let me know what you are thinking 🚀

## Where to get Draftist

You can download the Action Group from the Drafts Action directory: [Draftist Action Group](https://directory.getdrafts.com/g/1wK)

The code and also all Action Descriptions and Instructions are hosted in the [Draftist GitHub repository](https://github.com/FlohGro-dev/Draftist)

Make sure to run the `Draftist Setup/Update` Action after downloading the Action Group into your Drafts App.