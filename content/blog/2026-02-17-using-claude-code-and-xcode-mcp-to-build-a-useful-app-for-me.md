---
  title: Using Claude Code and Xcode MCP to Build a Useful App for Me
  date: 2026-02-17T21:55:58.733+01:00
  tags: ["app-development","ai"]
  permalink: /blog/using-claude-code-and-xcode-mcp-to-build-a-useful-app-for-me/index.html
  summary: "Vibe-coding a personal iOS app with Claude Code and Xcode MCP to turn a Raycast‑based workflow into a native iOS app. In under two hours I gained a really useful app for managing registrations for our CAMPs — agentic coding can turn a niche need into a powerful, time‑saving tool."
  _social_post: "I built an iOS app for my personal use only in under 2 hours using Claude Code and Xcode MCP"
---

Last weekend, the registration for the youth camps that I'm involved in was launched. Similar to the last few years, we are blessed with many kids who want to be there, and we are booked out just a few minutes after the launch. I'm genuinely happy about that.

We're using the open source system pretix to manage the attendees for the different events. Without that system, we couldn't keep up with the number of people who want to join. It allows us to define quotas at the beginning and creates a waiting list so we can allow more people to join once we have more volunteers to spend a week at the CAMPs. Managing this is doable from the web interface, but I developed a [Raycast](https://www.raycast.com/hey/1441bcf2) extension just for myself to have easier access to orders and check the waiting list for people I am waiting for a response from, and so on. This was already a big boost in efficiency.

After this weeks launch of the registration and the first batch of messages afterwards were clarified I asked myself if this wouldn't be a great use to try agentic coding in Xcode and write a small app for me that I can use to quickly check positions on the waiting list, search for orders and check current vouchers for people who have moved up from the waiting list.

I am using [Claude Code](https://claude.com/product/claude-code) for scripting, and I could use some help with my OnThisDay app if I'm stuck somewhere. I also used it to help with some HTML and CSS stuff on my website here, but I never used it to fully [vibe code](https://en.wikipedia.org/wiki/Vibe_coding) something. As much as I dislike generative AI for creating images / videos, I am also kinda divided for writing code. A lot of the same arguments can be applied there - writing software is also a creative process, and it definitely changes with all those coding agents. For things that I ship publicly, I want to know exactly what the LLM changed, and I'm heavily relying on `git` to track those changes. In the end, I think that as a developer, I need to make use of technologies that allow me to do things I couldn't do without them (even if it's just an efficiency thing).

Back to my vibe coding test… With Xcode 26.3 agentic coding was baked into itself, but it also allows users to [give external agentic coding tools access via mcp](https://developer.apple.com/documentation/xcode/giving-agentic-coding-tools-access-to-xcode). You can add Xcodes MCP server by running

```bash
claude mcp add --transport stdio xcode -- xcrun mcpbridge
```

After a confirmation in Xcode, Claude can now use all the tools it provides, which makes it more capable than ever.  
So I set up a new blank app and repository first. Then I took my own Raycast extension and asked Claude to summarize its features and write a plan to implement the same functionality into an iOS app. The result was a pretty good summary of the features and a solid idea for the app. I made some adaptations to it and further refined some details before throwing it into Claude Code in the correct directory and letting it work for a bit on that. After ~10 minutes, it reported that it finished and the app is working. It wasn't. But nevertheless, the initial stuff already looked quite good. Basically, the app is just a tab bar that displays different kinds of lists for data retrievable via the pretix REST API. There were some issues with reading the responses from the API, but after another 15 minutes, I had a basic working thing on my device. Of course, I didn't review the whole initial code; two things made me sure nothing harmful could be done: I reviewed the API access file and also ensured that the token I provided to the app only had read access to the data.

There were a few things that I tweaked myself afterwards, but mostly I stuck to vibe code the things I didn't like (visually or feature-wise) and reviewed every new increment quickly in the git diff with [lazygit](https://github.com/jesseduffield/lazygit).

This app won't be useful for anyone else, but given the time investment of approximately 1 hour, and maybe another 30 minutes for things that just make it look better, it will pay off very soon through my usage. I can't share screenshots of the app here since it's basically displaying data of the attendees, and pixelating them will end up in a fully censored screenshot, but trust me, it worked, and it's really useful for me already.

I think that the Xcode MCP tools are a game-changer for tools like Claude Code, but they also burn a lot of tokens 😀. Testing vibe coding with an idea for an app like this was a good experience, but as mentioned, I'd never ship this publicly because if something breaks, it would cost me some time to figure it out if Claude can't, and I don't want to risk this for things I throw out into the public. Nevertheless, it definitely proved how capable it is, and I might create other tools for myself when I feel the need to. This allows me to build things I wouldn't built just because of the time it would require building this up by myself.

I would be interested if you also created such tools for yourself. Let me know 😊

