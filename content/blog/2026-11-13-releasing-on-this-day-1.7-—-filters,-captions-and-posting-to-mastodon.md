---
  title: Releasing On This Day 1.7 — Filters, Captions and Posting to Mastodon
  date: 2026-11-13T23:46:29.000+01:00
  tags: ["development","app-development","onthisday"]
  permalink: /blog/releasing-on-this-day-1.7-—-filters,-captions-and-posting-to-mastodon/index.html
  summary: "On This Day 1.7 is out. You can filter the grid to favorites, videos, Live Photos and more, your streak syncs between devices and Streak Saver reminds you before it breaks, captions and keywords from Photos show up in the app, and you can post your (oldest) photo of the day to Mastodon."
  _social_post: "On This Day 1.7 is out 🎉 and here is my blogpost about it with some more details. #OnThisDay #IndieDev #Photography"
---

If you don't know my app [On This Day Rewind](https://apps.apple.com/us/app/on-this-day-rewind/id6754617354) yet, give it a try — it shows you the photos you took on this exact day in past years.

Version 1.7 is out, and most of it started as messages from users - so thank you for writing in! The release brings a filter for the grid and streaks that sync between your devices. The app also shows the captions and keywords you added in Photos now, and you can post your (oldest) photo of the day to Mastodon.

## Filter the Grid (Pro)

Next to Select there's a new filter button. It lets you pick what the grid shows: Photos, Live Photos, Portraits, Panoramas or Videos. You can narrow it down further to favorites, edited photos or photos with a location.

A bar under the title shows what you picked and how many photos match, and if nothing matches at all, the app offers to clear the filter. The filter stays on until you clear it - even after restarting the app.

![Two screenshots of the On This Day Rewind photo grid on an iPhone Duo. On the left, a filter bar under the title reads "Panoramas · Videos · Favorites · 0 of 12" above an empty grid with the message "No photos match the filter" and a "Clear Filters" button. On the right, the bar reads "Photos · With Location · 7 of 12" above a grid of safari photos grouped by year, showing antelopes in the desert, sand dunes, a giraffe, a gravel road and elephants.]({{ baseUrl }}/assets/2026-11-12-on-this-day-1-7-photo-filter.png)

## Syncing Your Streak Across Your Devices (Pro)

Your streak now syncs through iCloud. If you use the app on a second device or set up a new iPhone, it picks up where you left off. This also makes sure that you don't need to check the app on the same device each day to keep your streak alive.

Streak Saver sends you a reminder in the evening if you haven't opened the app yet and your streak is about to end. You can set it up in Settings → Notifications.

If you missed a few days anyway, Repair Streak in Settings fills a gap of up to 3 days - once every 30 days.

## Captions and Keywords from Photos

You're getting this feature thanks to requests from Alexander and Bebeto!

If you add captions or keywords to your photos in the Photos app, you'll now see them in the photo details - the (i) button in the fullscreen view of an image (this needs iOS 27). Turn on Captions & Keywords in Settings to also show the caption in the fullscreen view, right below the map (if there is one).

With Pro, you can also edit a caption and keywords right in the app. The changes are saved to your Photos library.

## Post Your Oldest Photo to Mastodon (Pro)

This one arose from a post series by [Maique](https://social.lol/@maique) - he posts the oldest photo of the day on a regular basis, and I wanted to make this simpler from within the app. Thanks, Maique! In _Settings → Mastodon: Oldest Photo_ you can turn it on and connect your Mastodon account with an access token. There you'll also see a switch to turn off creating a draft for the alt text using Apple Intelligence. The draft is generated with Apple's Private Cloud Compute, and only when you use this feature. Everything else still happens on your device.

At the bottom you can add a default text that is used for the images you post with that feature so you don't need to type this over and over again.

Once enabled, a subtle button appears when you scroll down through your grid. Tap the button and the photos from the oldest year come first. You can long-press one to see it bigger before you pick it. You can edit the (generated) alt text and the text you want to post the image with before sending it to Mastodon.

You can change the post text and the visibility in Settings. And if you don't want to post today, tap the x on the button to hide it until tomorrow.

This is a really niche feature, but I just liked the idea and it was easier to implement than I thought - and because it's my app I added it :) I hope some users will join in and share their old shots with us. Maybe I can add further services in future versions, too.

![Three screenshots of the Mastodon feature in On This Day Rewind. On the left, the "Mastodon: Oldest Photo" settings with switches for "Show 'Share your oldest photo'" and "Write alt text with Apple Intelligence", fields for the Mastodon server and access token, and step-by-step instructions for getting a token. In the middle, the "Oldest photo" sheet with a concert photo of an audience in front of a stage lit by blue and white light beams, the alt text drafted by Apple Intelligence reading "People watch a stage performance lit by blue and white beams.", the post text starting with "My oldest photo from today, 11 years ago." and a "Post to Mastodon" button. On the right, the confirmation "Posted to social.lol" with a preview of the published post from @flohgro@social.lol.]({{ baseUrl }}/assets/2026-11-12-on-this-day-1-7-oldest-photo-mastodon.png)

## Showing Place Names

The map in fullscreen now shows a small bubble with the name of the place, like the city and the state or country.

This was something requested by [Jordan](https://mstdn.ca/@jkrahn/116852758101229665) months ago, and I finally added it. The biggest problem with it is that I didn't add this earlier - it's such a subtle but also very useful feature. I mean, have a look at the screenshot - who doesn't want to see an elephant crossing a dirt road in the middle of San Francisco? (kudos to my demo images 😆)

![A fullscreen photo in On This Day Rewind on an iPhone Duo, showing two elephants crossing a dirt road in front of a white off-road truck, dated "13. November 2024 at 12:00". The Apple Maps snippet below the photo shows a pin in the middle of San Francisco, with a small bubble in its top left corner reading "San Francisco, United States".]({{ baseUrl }}/assets/2026-11-12-on-this-day-1-7-place-name-bubble.png)

## Full List of Changes

- new: filter the day's photos (Pro)
- new: show only favorites in widgets (Pro)
- new: share your oldest photo of the day to Mastodon, with alt text from Apple Intelligence (Pro)
- new: add or edit a photo's caption right in the app (Pro)
- new: add and remove a photo's keywords in the caption sheet (Pro)
- new: see the caption and keywords from Photos in the photo details and, with the new setting, in fullscreen below the map
- new: your streak now carries over to all your devices through iCloud, also to a new iPhone (Pro)
- new: Streak Saver notification warns you in the evening before your streak ends (Pro)
- new: fullscreen map shows where a photo was taken — thanks, Jordan!
- new: videos start muted while other audio plays, and your music keeps playing — thanks, Andrew!
- improved: streak survives clock changes at midnight, and Settings can repair a small gap
- improved: Open in Photos App offers to reinstall a missing Shortcut, and the FAQ links to it
- changed: feedback e-mail includes install source, device, Pro status and all settings
- fix: daily notifications now show a different message each day, chosen from a bigger list
- fix: fast scrolling through a day with many photos no longer jumps back to rows already seen
- fix: large streak counts no longer overflow the side bar on the closed iPhone Duo
- fix: the year on the app icon is easier to read

That's 1.7. As always, let me know what you think - and keep your ideas coming 😊
