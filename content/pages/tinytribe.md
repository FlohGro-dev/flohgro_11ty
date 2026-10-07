---
layout: layouts/base
title: TinyTribe
permalink: /tinytribe/
description: "Who's due next, and whose birthday comes next? A small iOS app for your friends' pregnancies and kids."
---

<div class="post-card otd-hero">

# TinyTribe

Friends have babies. Cousins have kids. And somehow you're supposed to remember who's due in March, how old the twins are now and whose birthday is on Saturday.

I kept getting it wrong, so I built **TinyTribe**. Open it and you see who's due next and whose birthday comes next. That's it, most days.

<div class="otd-features">

- A countdown for every pregnancy, even if all you know is "sometime in spring"
- Ages that fit small kids: weeks, then months, then "1 year and 3 months"
- A colour tile per family, with the parents, kids and godparents on one page
- Reminders, widgets for your Home Screen and Lock Screen, and Siri
- Everything stays on your iPhone. No account, no ads, no tracking

</div>

Free for up to three kids and pregnancies. One purchase lifts the limit, and there's no subscription.

**Coming soon to the App Store.**

</div>

<div class="post-card otd-support" id="otd-support">

## Support

Thanks for trying TinyTribe. I built it for my own circle of friends first, and I'm happy every time it helps someone else keep track of theirs.

Something broken or confusing? Just send me a message.

<div class="contact-grid">
<a href="mailto:tinytribe@flohgro.com" class="contact-card">
<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
<span class="contact-name">E-Mail Support</span>
<span class="contact-handle">tinytribe@flohgro.com</span>
</a>
<a href="/contact/" class="contact-card">
<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
<span class="contact-name">Mastodon & More</span>
<span class="contact-handle">All my social profiles</span>
</a>
</div>

<span class="otd-privacy-link"><a href="/tinytribe-privacy-policy/">Privacy Policy & Terms</a></span>

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
