---
  title: Some New Subtle Drafts Themes
  date: 2026-05-31T23:07:56.635+02:00
  tags: ["ai","drafts","themes"]
  permalink: /blog/some-new-subtle-drafts-themes/index.html
  summary: "I ported four subtle themes I like — Rosé Pine, Everforest, Nord and Kanagawa — into Drafts. Thirteen variants in total, built with some help from Claude. Now with Flexoki added too."
  _social_post: "Time for some new @Drafts themes"
---

*Update (10th June 2026): I've since added a Flexoki theme in dark and light. You'll find it at the end of the list.*

Every other year I get the urge to change the look of Drafts for me a bit. My [Catppuccin themes](https://flohgro.com/blog/catppuccin-drafts-themes/), especially [Catppuccin Mocha](https://directory.getdrafts.com/t/2Vm), were probably the most loved ones for me until now. But once again I wanted a few more options to add into my own mix. In the past I played around with creating my own color palettes but sooner than later this was always kind of a burden and I didn't like the results in the end - there are many people having more taste and feeling for colors that match brilliantly together. 

So I went looking at what subtle themes are out there that I could replicate in Drafts.

I ended up spending a few evenings porting four new palettes into Drafts themes: _Rosé Pine_, _Everforest_, _Nord_, and _Kanagawa_. All four change the look of the app without being so punchy that you won't use them for long reading or writing, and that's exactly what I wanted.

A quick note before the list: these are ports, not reinterpretations. I pulled the exact published values straight from each project so the colors should match what you'd see anywhere else they're used.

## How I built them

Thirteen themes is a lot of files to hand-edit, and a Drafts theme is around 600 lines of JSON — almost all of it an identical block that maps names like `heading` or `accent01` to named colors. Only about 25 colors per theme actually carry the palette. I didn't write them by hand. Claude was a big help with building the workflow and related scripts to create the themes. I started by pointing it to one of the Catppuccin themes I have in my `iCloud Drive/Drafts5/Documents/Library/Themes` directory and the [documentation](https://docs.getdrafts.com/docs/extending/development/theme-format). With the picked themes I advised Claude to research the color palette as hex values for the different variants and crosschecked them with the docs of the themes before moving on.

A generic python script reads that data, and spits out a complete, valid theme plus an initial version of a description for the directory. Adding a palette just means dropping in a file with the data and re-running the script.

The script I built using Claude confirms every theme has the full set of color keys and valid hex, that the six heading accents are distinct, and that the cursor has enough contrast against the background. During building and testing the themes I noticed, e.g., that the light versions had a basically invisible cursor until I enforced more contrast / color distinction for the `textCaret` scope.

Testing each and every theme was a bit time consuming but also kind of fun - uploading them to the directory and adjusting all descriptions afterwards to have links to the different variants within them was also a bit of monkeywork, but now it's done and here are the themes:

## Rosé Pine

![Screenshots of the Rose Pine theme in Drafts App]({{ baseUrl }}/assets/rose-pine-drafts-theme.png)

The natural next step after Catppuccin. Soft, muted, faintly warm, with a lovely palette of colors. It comes in three flavors:

- [Rosé Pine (main)](https://directory.getdrafts.com/t/26N) — the dark original
- [Rosé Pine Moon (dark)](https://directory.getdrafts.com/t/26O) — a slightly lighter, gentler dark
- [Rosé Pine Dawn (light)](https://directory.getdrafts.com/t/26P) — the light variant

Source: [rosepinetheme.com](https://rosepinetheme.com)

## Everforest

![Screenshots of the Everforest theme in Drafts App]({{ baseUrl }}/assets/everforest-drafts-theme.png)

Green-based and earthy - quite refreshing when I open it now that I've used Catppuccin for such a long time. It ships with both dark and light backgrounds, each in three contrast levels:

- [Everforest Dark Hard](https://directory.getdrafts.com/t/26H)
- [Everforest Dark Medium](https://directory.getdrafts.com/t/26I)
- [Everforest Dark Soft](https://directory.getdrafts.com/t/26K)
- [Everforest Light Hard](https://directory.getdrafts.com/t/26J)
- [Everforest Light Medium](https://directory.getdrafts.com/t/26M)
- [Everforest Light Soft](https://directory.getdrafts.com/t/26L)

Medium is the default and a good place to start. Soft has the lowest contrast, and hard provides a bit more separation.

Source: [github.com/sainnhe/everforest](https://github.com/sainnhe/everforest)

## Nord

![Screenshot of the Nord theme in Drafts App]({{ baseUrl }}/assets/nord-drafts-theme.png)

Cool, arctic, minimal blue theme created for focus and uncluttered design: [Nord](https://directory.getdrafts.com/t/26Q)

Source: [nordtheme.com](https://www.nordtheme.com)

## Kanagawa

![Screenshot of the Kanagawa theme in Drafts]({{ baseUrl }}/assets/kanagawa-drafts-theme.png)

Inspired by the colors of Hokusai's *The Great Wave*. Warm and muted theme in three variants:

- [Kanagawa Lotus (light)](https://directory.getdrafts.com/t/26R) - for when you're out in the open.
- [Kanagawa Wave (dark)](https://directory.getdrafts.com/t/26S) - the dark default
- [Kanagawa Dragon (dark)](https://directory.getdrafts.com/t/26T) - dark and lower contrast - for late night sessions

Source: [github.com/rebelot/kanagawa.nvim](https://github.com/rebelot/kanagawa.nvim)

## Flexoki

![Screenshot of the Flexoki theme in Drafts]({{ baseUrl }}/assets/flexoki-drafts-theme.png)

Added after the original four: an inky scheme for prose and code. Based on the [Flexoki](https://stephango.com/flexoki) palette by Steph Ango, it comes in a dark and a light variant:

- [Flexoki Dark](https://directory.getdrafts.com/t/26X)
- [Flexoki Light](https://directory.getdrafts.com/t/26Y)

Source: [stephango.com/flexoki](https://stephango.com/flexoki)

## Summing Up

That's fifteen themes across the five different families. I am constantly switching between them to test which ones I'll settle on. I basically never use Drafts in light mode so I'm mainly focusing on the dark variants. I have a couple of workspaces that I'm using on a regular basis so having a few different ones to choose from is actually a great way to distinguish them visually.

If you use one and it makes your Drafts a nicer place to write, that's the whole point. And if you'd like to support the work, you can [donate here](https://flohgro.com/donate).