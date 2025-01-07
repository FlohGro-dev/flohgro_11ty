---
title: Say Hello to 11ty 🚀
date: 2025-01-07T18:15:28.355+01:00
tags: ["11ty","general"]
permalink: /blog/Say-Hello-to-11ty-🚀/index.html
draft: true
---

Over the last ~two weeks I took some time to **finally** work on a project that I wanted to do since I first visited [@Robb](https://social.lol/@Robb)'s awesome [website](https://rknight.me). Besides caring for our [little one](https://social.lol/@flohgro/113730313406491012) I had some time to finish my initial version of this *submarine* project.

Ever since I visited the first static generated sites I wanted to replace my WordPress based website with something like this but I always was afraid of the amount of work it would be. The [WordPress drama](https://www.theverge.com/2024/9/27/24256361/wordpress-wp-engine-drama-explained-matt-mullenweg) also played a minor role in my decision to get working.

So I started the adventure and looked how I could migrate my website to [Eleventy](https://www.11ty.dev) - I have to admit I didn't do much of a research of which generator would be the best for me but I don't regret going with 11ty at all. I was amazed that with [@11ty/import](https://www.11ty.dev/docs/migrate/wordpress/#use-@11ty/import) ([GitHub repository](https://github.com/11ty/eleventy-import)) there is a command line tool to convert a WordPress blog to static files just via its URL. This was way too easy in the beginning. I moved on integrating the content into the [Eleventy Base Blog](https://demo-base-blog.11ty.dev) to have a basic - ready to use - layout (I need to say that I have no experience with HTML and even less with CSS). A running version was there within a few hours (a lot of dabbling in the documentation and throwing error Messages at ChatGPT helped) and I was really amazed about the performance and about its simple look.

Nearly every evening (after my wife and our boy went to bed) I was eagerly working on the new website. I learned a lot but I also think I'm doing basic things and good practices wrong on this website - the important thing? - **it works!** 

I messed around with stylings in CSS and wrote my first `.njk` files for layouts and pages. I wanted to smash the screen when buttons or text didn't behave like I thought they should but in the end I got the most things working as I intended. There are some html workarounds in it and I'm sure many people with experience in those languages will bury their head in the sand if they took a closer look into the sources - but I don't care - **it works!**.

This project also was a good excuse to use [Figma](https://figma.com) for the first time and I played around to create my own personal logo which might not be perfect but it was in my mind to built one from the first day I published my original website.

After roughly about a week I was ready to gather some feedback while the page was still hosted on GitHub Pages - so I [asked for it](https://social.lol/@flohgro/113746309888131420) and thankfully [WLW](https://social.lol/@wlw72@mastodon.social) and [Donovan Watts](https://social.lol/@dnvnwtts@indieweb.social) provided some very useful feedback. 

I reworked a few things and then I had to find a solution to publish the site to my hosting provider at [Hetzner](https://hetzner.cloud/?ref=HoOfQzkLxK0o). While GitHub Pages would also work with a custom domain I didn't want to stop there and had another  reason to try something I never used until then - [GitHub Actions](https://github.com/features/actions) - after some research I went with the simple solution to use the [FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) to push the files to my public_html folder on my website. This works great and takes less then a minute for building and deploying the content after a change in my repository.

I'm very proud to launch my new website with a complete redesign today - it was a lot of fun to work on that and it was well worth it because I really like the result and the new workflows I'm able to use now. I want to thank WLW and Donovan again for reviewing my initial draft and a lot of people in the Eleventy Community where I took some inspirations from the sources. Special thanks to Robb again for his excellent work and I already have plans for even more sophisticated workflows and things that are now possible since the switch to 11ty. Last but not least I need to thank the [Zach Leatherman](https://social.lol/@zachleat@zachleat.com) for maintaining 11ty itself.

I need to apologize if I broke links you already saved from my WordPress page - I think 95% of the links did change with this major rework and I hope the [search](/search) page will help to rediscover the posts you saved in the past. If it doesn't - just [reach out](/contactme) and I'll find the content for you again.