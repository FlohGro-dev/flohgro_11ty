---
  title: Releasing On This Day 1.4 — Live Photos, Ambient Backgrounds and Add to Album
  date: 2026-08-18T17:19:24.122+02:00
  tags: ["onthisday","development","app-development"]
  permalink: /blog/releasing-on-this-day-1.4-—-live-photos,-ambient-backgrounds-and-add-to-album/index.html
  summary: "On This Day 1.4 is out. Live Photos now play in fullscreen, the background colors follow the photo you're looking at, and you can finally add images to your albums right from the app — plus a Pro option to exclude albums you'd rather not see. No screenshots this time, just a quick run through the release notes."
  _social_post: "On This Day 1.4 is out 🎉 Live Photos play in fullscreen, ambient backgrounds follow your photo's colors, and you can add images to albums right from the app. https://apps.apple.com/us/app/on-this-day-rewind/id6754617354 #OnThisDay #IndieDev #Photography"
---

If you don't know my app [On This Day Rewind](https://apps.apple.com/us/app/on-this-day-rewind/id6754617354) yet, give it a try — it shows you the photos you took on this exact day in past years.

As much as I would like to write a more detailed post for the new version of my app, I just can't spend the time right now. At the same time I don't want to hold back a release for you, my users, just because I can't spend the time to write and create proper screenshots / demos right now.

So here is a quick run through the release notes.

## Live Photos

In the fullscreen view for images, Live Photos are now supported and will play by default when opening or swiping between images. I personally enjoy that images come more to life with this. If you don't like it, you can simply disable it in the new "Live Photos" setting.

## Ambient Backgrounds

In the image grid and the fullscreen view, the background color now roughly follows the colors of the displayed image(s). You can choose if you want to see those in both the grid and the fullscreen view, just one or none of them, in the new "Ambient Backgrounds" setting.

I can't tell you how much time it cost me to find an algorithm that creates colors that I enjoy and still is performant enough to not create stutters when scrolling — but I never disabled it again once it worked as it is released now.

## Albums

Many users requested to add images to albums right from the On This Day app — now you can. A new button in the toolbar of the fullscreen view and the multi select view now allows you to add one or more images to your albums. In the fullscreen menu, tap the three dots and choose "Add to Album".

Pro users can now also exclude albums whose images shouldn't be displayed in the app. This could be useful if you e.g. log exercise machine settings, food pictures or something like that. In the new "Photo Selection" settings you can choose the albums that should be excluded.

## Polishing Touches


- In the widget you can now choose to open the app instead of the tapped photo.
- RAW and JPEG versions of the same shot share one tile instead of showing up twice.
- If you tap a video in fullscreen it now shows or hides the map and toolbar like it should.
- Deleting a batch of selected photos asks once instead of twice.

I included a few visual polish items in this release that you may or may not notice. The animation to open or close a photo is updated, many more smaller animations are also updated, and I did a few changes to the Liquid Glass buttons.

That's 1.4. As always, let me know what you think 😊