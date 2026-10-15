---
  title: Releasing On This Day 1.6 — iPhone Duo, Landscape and Feature Requests
  date: 2026-10-15T21:44:10.021+02:00
  tags: ["development","app-development","onthisday"]
  permalink: /blog/releasing-on-this-day-1.6-—-iphone-duo,-landscape-and-feature-requests/index.html
  summary: "On This Day 1.6 is ready for iPhone Duo. Adapting to the foldable led to a new Photo Size setting that replaces Column Count, and the grid now turns to landscape on every iPhone. There are several performance improvements, and a new Feature Requests board lets you suggest and vote on what comes next."
  _social_post: "On This Day 1.6 is out: ready for iPhone Duo, and with that you can also use it in landscape on any other device. There are many performance improvements, and a new Feature Requests board powered by Kickstart Signal from @twostraws@mastodon.social - suggest ideas and vote on what's next. #OnThisDay #IndieDev"
---

If you don't know my app [On This Day Rewind](https://apps.apple.com/us/app/on-this-day-rewind/id6754617354) yet, give it a try — it shows you the photos you took on this exact day in past years.

1.6 adds support for the iPhone Duo. While adapting the app to the new screen sizes, I also changed the layout so that the grid finally turns with your iPhone into landscape. On top of that, there are the usual performance improvements, and a new place in the app where you can tell me what you'd like to see next, using Kickstart Signal.

## Ready for iPhone Duo

The grid and the fullscreen view adjust when you fold, unfold or rotate your iPhone Duo. On the closed iPhone Duo, the buttons sit in the bar at the side of the screen, and when you hide them, a photo fills the whole screen.

Testing and refining this was a challenge, since I only had the simulator on my Mac and couldn't actually "feel" the app in my hands.

![Screenshots of the On This Day app in different orientations and folding states of the iPhone Duo]({{ baseUrl }}/assets/2026-10-15-on-this-day-iphone-duo-screenshots.webp)

On iPad, Mac and the open iPhone Duo, photos and Live Photos in fullscreen now load at the full size of the window. The buttons at the top of the fullscreen view also got a slightly new look, with the actions grouped together.

## Photo Size instead of Column Count (Pro)

This change is basically a result of adapting the layout for the Duo. When I unfolded the device in the simulator, I quickly noticed that the "Column Count" setting wasn't a good idea anymore. For example, two columns look totally fine on the closed Duo, but when you unfold it, the images blow up to a huge size.

So I changed the setting to define a photo size, and the column count is a result of the selected size. Instead of picking a number of columns, you choose how large the photos should appear - and a live preview of the grid shows you the result while you adjust it.

## The Grid Turns to Landscape

So far the grid on iPhone stayed in portrait no matter how you held it. Now it rotates to landscape and shows more photos in each row. This works the same on every wider screen: you get more columns, so photos keep about the same size in landscape, on iPad and on Mac.

After adapting the layout for the Duo and adding the new Photo Size setting, enabling landscape mode was easy.

## Videos from iCloud Don't Freeze Anymore

Videos stored in iCloud now start quickly and no longer freeze while they play. To make that work, they stream at a smaller size - videos stored on your iPhone still play in full quality. And if a video has to wait for more data, a spinner shows up, so a short pause doesn't look like a frozen picture anymore. Especially with a weaker connection, this should make it clearer what's happening.

## New Feature Requests

Some of the features in the last updates started as requests from you - like the Merged Grid in 1.5 or adding photos to albums in 1.4. Now there's a dedicated place for that: a Feature Requests board in Settings → Feature Requests. You can suggest an idea or vote on what others have asked for. New requests show up once I've read them, so don't worry if yours doesn't appear right away. This is enabled by [Kickstart Signal](https://mastodon.social/@twostraws/116455657942809795).

## Fixes & Polish

- Performance improvements: Swiping between photos in fullscreen is smoother, and days with lots of photos fill in faster.
- Photos from this year no longer show up when Include Current Year is off and the time zone auto-fix is on (Pro).

That's 1.6. As always, let me know what you think - and a big thanks to the testers who reported issues during development 😊
