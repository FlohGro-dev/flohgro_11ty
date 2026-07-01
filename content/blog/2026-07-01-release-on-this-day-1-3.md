---
  title: Releasing On This Day 1.3 — Time Zones, Date Stamps, and Tidier Years
  date: 2026-07-01T07:07:56.635+02:00
  tags: ["app-development","development","onthisday"]
  permalink: /blog/release-on-this-day-1-3/index.html
  summary: "On This Day 1.3 is out, and it's a big one. The app now supports time zones — photos show the zone they were actually taken in, and an optional banner can fix the cases where a time-zone difference put a photo on the wrong day. There's a new Pro option to burn the date right onto a photo before you share it, relative dates like \"3 years ago\" in fullscreen, a Pro setting to cap rows per year, plus faster, higher-res photo loading and a refined app icon. Thanks to everyone who tested the betas — this one took a while."
  _social_post: "On This Day 1.3 is here: the app can now fix time zone overlaps, you can burn the date right onto a shared photo, and the icon is slightly refined (and fixed on iOS 27). This one took a while 😅
https://apps.apple.com/us/app/on-this-day-rewind/id6754617354"
---

[On This Day Rewind](https://apps.apple.com/us/app/on-this-day-rewind/id6754617354) shows you the photos you took on this exact day in past years. I built it because I love that little joy of reflection of "oh, that's right, we were there." I'm using it every morning.

Version 1.3 took a while, but it's a good one. It's mostly about three big things: the app finally supports time zones — from just displaying them to (much more complicated) fixing time-zone overlaps that pushed photos onto different dates; you can now burn the date right onto a photo before you share it; and you can customize the date text displayed in fullscreen even more and restrict the number of rows displayed per year. Thanks to everyone who suggested these features and tested the betas — a lot of this came directly from your feedback.

![A dramatic photo of Kjeragbolten, a boulder wedged in a rock crevice high above a Norwegian fjord, with blue sky above and water far below. A capsule burned onto the image reads \"9 years ago\".]({{ baseUrl }}/assets/2017-07-01-on-this-day-burned-date-kjeragbolten.jpg)

Here's what's new and, more importantly, the reasoning behind it.

## Sharing a Photo With the Date on It

Sharing images from On This Day to others is one of its great use cases. It's so cool to remind family and friends about big or small moments from the past. With this new feature this gets even better.

I wanted to build this new Pro feature for a long time, and it was requested a few times too. When you share a memory, you can now have the date burned right onto the image as a glass capsule — instead of, or alongside, the caption text. The photo carries its own context, without you typing "this was 3 years ago today" every time. You set this up in Settings → Image Share Setting, and it just uses your preferred configuration of the _Fullscreen Date Format_.

A few smaller sharing things came along with it:

- The share sheet now previews the image, so you can see what you're about to send before you send it.
- The shared text includes the App Store link.

## Time Zones, and Why a Photo Can Show up on the Wrong Day

This one was the most challenging.

If you travel, you've probably hit the weird case where a photo shows up on a different day. A few years back we made a road trip through California and a few national parks in Utah and Arizona. It was great — and On This Day let me look back on that trip day by day. The only real bummer was that, due to the time difference, pictures from the evening on one day showed up on a completely different day.

Now On This Day tries to look at where a photo was actually taken. The images can display in their original capture time zone, and if it's a foreign one you'll get a little caption like "Los Angeles · PDT" so you know what you're looking at.

![A fullscreen photo in On This Day Rewind showing Yosemite Valley with snow-dusted granite cliffs and a green forest. An overlay caption reads "3 years ago at 09:07", "Los Angeles · PDT", and "22 of 92", with a small Apple Maps snippet of the location below.]({{ baseUrl }}/assets/2026-07-01-on-this-day-timezone-display.png)

For the wrong-day problem, there's now an optional banner that quietly offers to fix the grouping when a photo landed on the wrong calendar day because of a time-zone difference. You tap it, the photo moves to the day it belongs on, and that's it. There's a new FAQ entry that explains a bit more about it, and you'll find a new Time Zones section under Fullscreen Date Format in Settings.

![The On This Day Rewind photo grid with a banner titled "Photos from other time zones" asking "Adjust grouping so each photo lands on its local capture day?" It notes "22 would join · 38 would move out" and offers "Fix this day" and "Always do this" buttons, over a grid of Yosemite and road-trip photos.]({{ baseUrl }}/assets/2026-07-01-on-this-day-fix-timezone-banner.png)

## More Control Over How Years Look

A couple of viewing improvements that make scrolling through your memories nicer.

You can now show relative dates in fullscreen — "3 years ago" instead of a full date — through the new Fullscreen Date Format setting. Sometimes you just want the feeling of how long ago it was, not the exact day.

And if you've got years with a lot of photos, there's a new Pro option to cap how many rows show per year, with a "See more" button to expand it. Keeps things tidy without hiding anything.

Photos also load faster and at higher resolution now.

## An App Icon Caveat

I also refined the app icon in this release — I'll probably iterate on it again in the future, but this round was actually triggered by some user feedback after I noticed a different rendering on the App Store than I expected. Some screenshots are in this [Mastodon conversation](https://social.lol/@flohgro/116766932066369821).

![Two versions of the On This Day Rewind app icon side by side on a black iPhone screen. Both show a stylised green mountain photo with a sun and the year 1993. The left icon has thick dark outlines; the right icon is smoother and softer with the contour lines removed.]({{ baseUrl }}/assets/2026-07-01-on-this-day-app-icon-change.PNG)

The TL;DR / my assumption is that with iOS 27 Apple made some changes to the Icon Composer and the rendering of app icons on the App Store.

While the rendering on the App Store was visible for me running iOS 26, the broken app icon only affected users running iOS 27 (AFAIK). I did some research with Claude and found out that there were discussions about issues when using `.svg` files for the parts of the icon (which is what I did). Returning to Pixelmator, refining each asset and exporting it as a .png file, only to reimport them into the "old" (= non-beta) version of Icon Composer and upload a new build of the app, seems to have fixed the issue.

The revised version loses all the contours, which looks better IMO.

---

That's 1.3. I hope On This Day gives you some happy moments every morning — and those new features make your experience even better. As always, let me know what you think, and share the app with your family and friends 😊
