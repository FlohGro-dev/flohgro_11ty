---
layout: layouts/base
title: On This Day
permalink: /onthisday/
description: "Revisit photos from today's date in past years. A simple iOS app — no algorithms, no feeds, no social anything."
ogImage: /assets/on_this_day_screenshot.webp
---

<div class="post-card otd-hero">

# On This Day

You've got thousands of photos you never look at. **On This Day** pulls up the ones taken on today's date in past years, so they don't just sit there.

No algorithm, no feed, no social anything. Just your photos, once a day.

<img src="{{ baseUrl }}/assets/on_this_day_screenshot.webp" alt="On This Day app showing photos grouped by year, a photo detail view with map, and settings" class="otd-screenshot" width="1500" height="994" loading="lazy">

<div class="otd-features">

- Your photos, sorted by year, so you can see how the same day looked over time
- Adjust the grid layout and sort order to your liking
- Tap a photo for details, including where it was taken on a map
- Daily reminders so you don't forget to check

</div>

<div class="otd-cta">
<span class="otd-badge-wrapper" aria-hidden="true">
  <img src="{{ baseUrl }}/assets/icons/app-store-badge.svg" alt="" class="otd-badge" width="120" height="40">
</span>
<span class="otd-cta-note">Coming soon to the App Store</span>
</div>

</div>

<div class="post-card otd-support" id="otd-support">

## Support

Thanks for using On This Day. I built it for myself first and I still use it every morning. Hearing that other people have made it part of their routine keeps me working on it.

Something broken or confusing? Just send me a message.

<div class="contact-grid">
<a href="mailto:onthisday@flohgro.com" class="contact-card">
<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
<span class="contact-name">E-Mail Support</span>
<span class="contact-handle">onthisday@flohgro.com</span>
</a>
<a href="/contact/" class="contact-card">
<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
<span class="contact-name">Mastodon & More</span>
<span class="contact-handle">All my social profiles</span>
</a>
</div>

<span class="otd-privacy-link"><a href="/onthisday-privacy-policy/">Privacy Policy & Terms</a></span>

</div>

{% include "random-quote.njk" %}

<script>
(function() {
  var hero = document.querySelector('.otd-hero');
  if (!hero) return;
  var btn = document.createElement('a');
  btn.href = '#otd-support';
  btn.className = 'otd-scroll-hint';
  btn.innerHTML = 'need help? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 13l5 5 5-5"/><path d="M7 6l5 5 5-5"/></svg>';
  hero.appendChild(btn);
})();
</script>
