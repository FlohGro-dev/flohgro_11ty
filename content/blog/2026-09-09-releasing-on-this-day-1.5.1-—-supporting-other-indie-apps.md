---
  title: Releasing On This Day 1.5.1 — Supporting Other Indie Apps
  date: 2026-09-09T11:57:25.598+02:00
  tags: ["development","app-development","onthisday"]
  permalink: /blog/releasing-on-this-day-1.5.1-—-supporting-other-indie-apps/index.html
  summary: "On This Day 1.5.1 is a small release with one change worth explaining: the app now shows recommendations for other indie apps via Kickstart Exchange — no tracking, never interrupting your photos, and off by default for Pro. Smart albums can be excluded now too, plus a few fixes. #OnThisDay #IndieDev"
  _social_post: "On This Day 1.5.1 is released. It integrates Kickstart Exchange by @twostraws@mastodon.social to show recommendations for other indie apps instead of buying ads - big shoutout and thanks for creating this. No user tracking or profile. Smart albums can now be excluded from the grid, and of course a few fixes."
---

If you don't know my app [On This Day Rewind](https://apps.apple.com/us/app/on-this-day-rewind/id6754617354) yet, give it a try — it shows you the photos you took on this exact day in past years.

1.5.1 is a small release, but it contains one change that I'd rather explain properly than hide in a bullet list: On This Day now shows recommendations for other small indie apps.

## Kickstart Exchange - Free Advertising for Indie Apps

An app like On This Day has no marketing budget, and paid ads are not something I want to spend money on. So I joined [Kickstart Exchange](https://exchange.kickstart.tools) built by [Paul Hudson](https://www.hackingwithswift.com/about): small apps recommend each other instead of buying ads.

Kickstart Exchange describes the idea like this: _On This Day shows ads for other indie apps, and every two shown earn one appearance for itself, without tracking people or devices_.

The most important part for me was that no data is collected about you. No tracking, no advertising profile, no device or account identifier. Nothing about your photos, your library or your location leaves your device — that hasn't changed and it won't.

You'll never see the ads in between your photos. In the free version they appear above the first year when you're scrolling up after skimming through your photos. With Pro below the last year. They are turned off by default for Pro users but can be turned on in Settings → Support Indie Apps if you want to support the idea (and see other apps in the network). You can also see an example there.

## Excluding Smart Albums (Pro)

The album exclusion from [1.4](https://flohgro.com/blog/releasing-on-this-day-1.4-—-live-photos,-ambient-backgrounds-and-add-to-album/) now covers smart albums too. The interface for the album exclusion was also updated and now has a search - useful if you have a lot of albums and don't want to scroll too much.

If you add images to an excluded album from within On This Day, these images will disappear immediately from the grid.

## Fixes & Polish

- The favorite heart moved away from the selection circle so the two don't fight for the same corner anymore.
- Adding multiple photos to an album at the same time did not always work properly - that's fixed.
- Improved the counting of milestones, streaks and the App Store rating suggestions.
- Memory optimizations for widgets to address rare issues with empty widgets.

That's 1.5.1. As always, let me know what you think 😊