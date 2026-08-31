---
  title: Releasing On This Day 1.5 — Merged Grid and 50% of September Proceeds for St. Jude
  date: 2026-08-31T22:38:25.164+02:00
  tags: ["onthisday","development","app-development"]
  permalink: /blog/releasing-on-this-day-1.5-—-merged-grid-and-50%-of-september-proceeds-for-st.-jude/index.html
  summary: "On This Day 1.5 is out. A new Merged Grid option removes the separation between years and shows all your photos in one continuous grid, you can now define the date format in your shared text yourself, and the widgets got some deserved love. The release also lands just in time for Relay's St. Jude fundraiser, so I'm giving 50% of the app's September proceeds to it."
  _social_post: "On This Day 1.5 is out 🎉 A new Merged Grid shows all your years in one continuous grid, you can define the date format in your shared text yourself, and many more smaller updates. It's also just in time for @relay@relayfm.social's St. Jude fundraiser, so I'm giving 50% of the app's September proceeds to it. If you'd rather donate directly: https://relay.fm/stjude https://apps.apple.com/us/app/on-this-day-rewind/id6754617354 #OnThisDay #IndieDev #Photography"
---

If you don't know my app [On This Day Rewind](https://apps.apple.com/us/app/on-this-day-rewind/id6754617354) yet, give it a try — it shows you the photos you took on this exact day in past years.

Version 1.5 is out, and the biggest change is another way to look at your photos: one merged grid instead of a stack of years. You can also more granularly define the format of the date that you share with an image, and the widgets got some fixes with this update.

The new release came out just in time for [Relay's St. Jude fundraiser](https://relay.fm/stjude). Since I'm a fan of their (Relay & St. Jude 😊) work, I'm giving half of the app's September proceeds to Relay's St. Jude fundraiser - read some more details at the end.

But first some details about the new update.

## One Merged Grid (Pro)

So far the app's grid was divided into stacks for each year. Pro users now have a new option for a Merged Grid in Settings that removes the horizontal separation and displays all images in a continuous grid instead. A small year badge marks the first photo of each year so you always know what you're looking at.

This was a user request, and right now I'm switching between both views regularly to find out which I enjoy more. I didn't want to break the existing pattern and instead wanted to give you the opportunity to choose your favorite - nothing changes by default.

If you cap the rows per year, a year now ends with a tile that tells you how many photos are hidden. Tap it and the rest unfolds.

## More Custom Dates in Shared Text

You can now fully customize the date format of the shared text, for example by writing `[date:MMMM yyyy]` to get "December 2024", or `[date:EEEE]` for the weekday. `[date]` on its own uses the selected preconfigured format.

You don't have to remember any of those date tokens. Tap the example below the text field to insert it, and the new help button lists every available token with an example next to it. The preview under the field shows the real result while you type.

## Widget Updates

I fixed some bugs in the widgets - e.g. widgets set to one or two photos could come up blank. That should now work for every supported size and count. Days that contain only videos aren't empty anymore either: a video shows up as a still frame with a play symbol.

A few more things came along with that. Widgets should refresh faster. The photo count you pick is finally respected — choosing 1 on a Medium widget gave you 2 before. The Extra Large widget on iPad honors your count instead of always showing 10, and goes up to 12 photos. And the photos in the Large and Extra Large layouts are sharper. Please be aware that not every number of images is supported at every widget size (and I can't restrict the displayed options in the widget without creating duplicate versions of them).

## Fixes & Polish

Of course I did some smaller fixes and polish in this version - here is a list of a few of them:

- Settings Restructured: Column count, rows per year, merged grid, current year and sorting now live together under one Image Grid entry.
- Fullscreen photos might be sharper on certain devices. They were loaded below the screen's real pixel size.
- Videos download faster, and a progress bar is shown during the download.
- Swiping down to close a Live Photo works right away instead of waiting for the motion to finish.
- An empty day now offers Previous and Next buttons that jump to the closest day with photos.

---

## 50% of September Proceeds Go to St. Jude

For the whole of September I'm giving 50% of the App Store proceeds from On This Day Rewind to [Relay's St. Jude fundraiser](https://relay.fm/stjude).

I just want to cite from their fundraiser page since I can't summarize this better:

> Each September, Relay rallies support for the lifesaving mission of St. Jude Children's Research Hospital® during Childhood Cancer Awareness Month.
>
> St. Jude has helped push the overall childhood cancer survival rate in the U.S. from 20% in 1962 to more than 80% today. By joining us, you can help give more kids a chance to live their best life and celebrate every moment. Your support. Their Tomorrow.

It's amazing that the community has given so much for this campaign over the years. We're blessed with a healthy young boy, so I can hardly imagine how kids and their parents must feel going through such a diagnosis. That's why I want to support this with some of the proceeds I'm receiving during this month. If you've been thinking about going Pro in On This Day - now is a great time.

If you already bought the IAP or would rather give directly, please do: [relay.fm/stjude](https://relay.fm/stjude). That gets the total further than my 50% can on its own. I would also be happy to see more developers join and donate parts of their proceeds 😊

Just to clarify - I'm talking about proceeds after Apple's commission, for sales between the 1st and the 30th of September. At the end of the month I'll pull the number from App Store Connect and donate it before the payout from Apple arrives (this usually takes a few weeks).

That's 1.5. As always, let me know what you think 😊