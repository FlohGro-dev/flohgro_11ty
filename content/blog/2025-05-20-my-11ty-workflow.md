---
title: My 11ty Blogging Workflow
date: 2025-05-20T22:15:17.387+02:00
tags: ["11ty","workflow"]
permalink: /blog/my-11ty-blogging-workflow/index.html
---

More than five months ago I launched my new website based on [11ty](https://www.11ty.dev). Since then I made some smaller adjustments, but other than messed up orders in RSS feeds and some formatting improvements I only added content and improved my workflow around it.

In this post, I want to give some insights into how I publish stuff to my blog and what tools and services are involved. The following image will give you an overview of the "pipeline" from start to finish - it's easier than it looks (especially to use), I promise. The image maps the workflow from writing drafts (left) through publishing actions (center) to content distribution via RSS feeds and social platforms (right), using color-coded boxes to distinguish manual steps, automation, shortcuts, and destinations. The resolution should be big enough so you can zoom into it.

![A detailed flowchart illustrating the automation and manual steps for publishing posts and quotes across various platforms. The chart is divided into three main sections labeled "Destinations" (teal), "Drafts Actions" (blue), and "Shortcuts" (purple), with automation steps marked in green and manual steps in red.
The flowchart uses arrows to show the direction of actions and connections between manual and automated processes, shortcuts, repositories, websites, RSS feeds, and social platforms.]({{ baseUrl }}/assets/flohgro-11ty-workflow.png)

I rely on the following tools and services:

- [Shortcuts](https://apps.apple.com/us/app/shortcuts/id915249334) by Apple
- [Drafts](https://getdrafts.com)
- [Working Copy](https://workingcopy.app) Git client for iOS
- [GitHub](https://github.com)
- [Hetzner](https://hetzner.cloud/?ref=HoOfQzkLxK0o) (* recommendation link)
- [echofeed](https://echofeed.app)

In general, all of my website content is managed through a GitHub repository. Any change in the repository triggers a GitHub Action that builds the 11ty page and syncs all content to my website.

Three things were most important when I designed my new webpage setup.

- I wanted to have a static page that loads fast and I have full control over (but also is easy enough to use for me) → that's why I chose 11ty 😊
- I don't want to be restricted by the device I'm using to publish content
- I wanted to publish (nearly) everything via my own site ([POSSE](https://indieweb.org/POSSE))

My current setup fulfills these requirements at least good enough for now - there is always room for improvement, but I'm really happy how this all works out right now. Let's dive into my workflow of actually publishing something to the web.

First of all, I distinguish between three types of content that I publish regularly:

1. **Social Posts**: status updates that are crossposted to Mastodon & Bluesky (even though I'm not very active there)
2. **Quote Posts**: quotes that I collect and want to share
3. **Blog Posts**: real posts on my blog (like this one)

I almost exclusively write any content within Drafts, independent of the platform. Once I finish writing, I can trigger Drafts Actions that either publish the content as one of the three content types. The actions will create and push a new file in the correct directory of the repository on GitHub. The difference between posting a social post or a blog post in the actions is the directory where the files are created and the metadata that they add as frontmatter to the files.

Posting images adds an extra step to the workflow. On iOS, I will first run a Shortcut that allows me to select the image(s) I want to publish. The shortcut asks me for the name of the image(s) and stores the image(s) in the assets directory of the repository within Working Copy. It will copy the correct path(s) to the image as markdown link into the clipboard so I can directly use them in the post I'm writing (e.g. `![]({{ baseUrl }}/assets/flohgro-11ty-workflow.png)`). I'll add alt-text and continue writing my post. Once the post is ready, another Drafts action prepares the file and stores it in the correct directory (blog posts / social posts) and then kicks off a Shortcut that will commit and push the changes to the repository on GitHub through Working Copy.

Until now, I never published posts with images from my Mac; that's why I didn't optimize this for the Mac for now. If I want to post images from the Mac, I'd add the image to the repositories directory and write the content with [nvim](https://neovim.io) or within [VS Code](https://code.visualstudio.com). Then I'd publish it using [lazygit](https://github.com/jesseduffield/lazygit) to the repository.
However, this is my current process if I make (bigger) layout changes to the website, since I can build and test the webpage locally first before publishing these changes.

The only post type I have not yet covered is quote posts. I store quotes that I like or that inspire me in drafts using dedicated tags. I wanted to publish them regularly and therefore created an automation on iOS that runs a Drafts Action on a schedule twice a week. This action will look for quotes that are not yet published (every published post gets tagged in Drafts). If there are quotes available, it picks a random one and creates a new file in the repository, fully automated.

Every change in the repository triggers a GitHub Action that builds and deploys the updated content to the web. If you're interested, you can have a look at the [workflow file](https://github.com/FlohGro-dev/flohgro_11ty/blob/main/.github/workflows/11ty_build_and_deploy.yml).

To distribute the new content to social media, I rely on [echofeed](https://echofeed.app), a great service built by [Robb Knight](https://rknight.me/). It reads the RSS feeds for the different content types and publishes (echoes) them to other services. It is heavily customizable and very easy to use. Once set up correctly, you don't have to worry about it anymore, which is exactly what I need.
