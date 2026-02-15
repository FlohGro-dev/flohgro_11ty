import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const postGraph = require('@rknightuk/eleventy-plugin-post-graph');
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import EleventyPluginOgImage from 'eleventy-plugin-og-image';
import { OgImage } from 'eleventy-plugin-og-image/og-image';
import { TemplatePath } from '@11ty/eleventy-utils';

// Bump this to force all OG images to regenerate after template changes
const OG_TEMPLATE_VERSION = '4';

class CachedOgImage extends OgImage {
  async outputFilePath() {
    const fileName = await this.outputFileName();
    return TemplatePath.standardizeFilePath(path.join('.cache/og-images', fileName));
  }
}

import pluginFilters from "./_config/filters.js";

import { DateTime } from "luxon";

import striptags from "striptags";

import { feedPlugin } from "@11ty/eleventy-plugin-rss";

const sortByDateDesc = (a, b) => {
  return new Date(b.data.date) - new Date(a.data.date);
};

const sortByDateAsc = (a, b) => {
  return new Date(a.data.date) - new Date(b.data.date);
};

fs.mkdirSync('.cache/og-images', { recursive: true });

export default function (eleventyConfig) {
  eleventyConfig.events.setMaxListeners(0);

  // Copy cached OG images to output after build completes
  // (passthrough copy runs too early, before the OG image plugin generates images)
  eleventyConfig.on('eleventy.after', async ({ dir }) => {
    const cacheDir = '.cache/og-images';
    const outputDir = path.join(dir.output, 'assets/og-images');
    if (fs.existsSync(cacheDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      for (const file of fs.readdirSync(cacheDir)) {
        fs.copyFileSync(path.join(cacheDir, file), path.join(outputDir, file));
      }
    }
  });

  // Determine the base URL
  const baseUrl = process.env.ELEVENTY_ENV === "production"
    ? ""
    : "";

  // Add baseUrl as global data
  eleventyConfig.addGlobalData("baseUrl", baseUrl);

  eleventyConfig.addCollection("blogPosts", (collectionApi) => {
    return collectionApi.getFilteredByTag("blog").sort((a, b) => {
      return b.date - a.date; // Sort by descending date
    });
  });

  eleventyConfig.addCollection("quotePosts", (collectionApi) => {
    let quotePosts = collectionApi.getFilteredByTag("quote").sort((a, b) => {
      return b.date - a.date; // Sort by descending date
    });
    return quotePosts.reverse()
  });

  eleventyConfig.addCollection("socialPosts", (collectionApi) => {
    let socialPosts = collectionApi.getFilteredByTag("post").sort((a, b) => {
      return b.date - a.date; // Sort by descending date
    });
    return socialPosts.reverse()
  });

  eleventyConfig.addCollection("draftActionDirectoryFeed", (collectionApi) => {
    return collectionApi.getFilteredByTag("drafts-action-directory-feed").sort((a, b) => {
      return b.date - a.date; // Sort by descending date
    });
  });

  eleventyConfig.addPassthroughCopy("assets")
    .addPassthroughCopy({ ".cache/og-images": "assets/og-images" })
    .addPassthroughCopy({
      "./public/": "/"
    })
    .addPassthroughCopy("src/js")
    .addPassthroughCopy({ "src/": "/" });

  eleventyConfig.addCollection("limitedBlogPosts", function (collectionApi) {

    let blogPosts = collectionApi.getFilteredByGlob("content/blog/*.md");
    blogPosts.sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });

    let latestBlogPosts = blogPosts.slice(0, 10);
    return latestBlogPosts.reverse();
  });

  eleventyConfig.addCollection("latestBlogPost", function (collectionApi) {

    let blogPosts = collectionApi.getFilteredByGlob("content/blog/*.md");
    blogPosts.sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });

    return blogPosts.slice(0, 1);
  });

  eleventyConfig.addCollection("recentBlogPostsWithoutLatest", function (collectionApi) {

    let blogPosts = collectionApi.getFilteredByGlob("content/blog/*.md");
    blogPosts.sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });

    return blogPosts.slice(1, 6);
  });

  eleventyConfig.addCollection("nowPosts", function (collectionApi) {
    return collectionApi.getFilteredByTag("now").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  eleventyConfig.addCollection("latestNowPost", function (collectionApi) {
    let nowPosts = collectionApi.getFilteredByTag("now").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
    return nowPosts.slice(0, 1);
  });

  eleventyConfig.addCollection("olderNowPosts", function (collectionApi) {
    let nowPosts = collectionApi.getFilteredByTag("now").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
    return nowPosts.slice(1);
  });

  // Adds the {% css %} paired shortcode
  eleventyConfig.addBundle("css", {
    toFileDirectory: "dist",
  });
  // Adds the {% js %} paired shortcode
  eleventyConfig.addBundle("js", {
    toFileDirectory: "dist",
  });

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return (new Date()).toISOString();
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(postGraph, {
    sort: 'desc',
    dayBoxTitle: true,
    selectorLight: ':root',
    selectorDark: '[data-theme="dark"]',
    boxColorLight: '#ccd0da',
    highlightColorLight: '#1e66f5',
    textColorLight: '#4c4f69',
    boxColorDark: '#313244',
    highlightColorDark: '#89B4FA',
    textColorDark: '#D9D9D9',
  });

  // Custom linked post graph shortcode — same visual as postGraph but with
  // clickable boxes that show post titles on hover
  eleventyConfig.addShortcode('postGraphLinked', (postsCollection, options) => {
    const showContent = options && options.showContent;
    const prefix = 'epg';

    const styleSheet = `<style>
    :root {
      --${prefix}-box: #ccd0da;
      --${prefix}-box-highlight: #1e66f5;
      --${prefix}-text: #4c4f69;
    }
    [data-theme="dark"] {
      --${prefix}-box: #313244;
      --${prefix}-box-highlight: #89B4FA;
      --${prefix}-text: #D9D9D9;
    }
    .${prefix} { color: var(--${prefix}-text); margin: 20px 0; font-size: 0.8em; }
    .${prefix}__year { text-align: center; font-weight: bold; margin-bottom: 10px; }
    .${prefix}__months { display: flex; justify-content: space-between; margin-bottom: 10px; }
    @media (max-width: 410px) { .${prefix}__months { display: none; } }
    .${prefix}__squares { display: grid; grid-template-rows: repeat(7, 1fr); grid-auto-flow: column; margin-bottom: 10px; grid-gap: 2px; }
    .${prefix}__box { aspect-ratio: 1 / 1; background: var(--${prefix}-box); }
    .${prefix}__box--empty { background: none; }
    .${prefix}__hasPost { background: var(--${prefix}-box-highlight); }
    </style>`;

    // Build map: year -> { offset, days }, dateKey -> [{ title, url }]
    const years = {};
    const posts = {};
    for (const post of postsCollection) {
      const d = new Date(post.date || post.data.date);
      const year = d.getFullYear();
      const start = new Date(year, 0, 1);
      const dayOfYear = Math.floor((d - start) / 86400000) + 1;
      const key = `${year}-${dayOfYear}`;
      if (!years[year]) {
        const jan1 = new Date(year, 0, 1);
        const isoDay = jan1.getDay() === 0 ? 7 : jan1.getDay();
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        years[year] = { offset: isoDay - 1, days: isLeap ? 366 : 365 };
      }
      if (!posts[key]) posts[key] = [];
      let label;
      if (showContent && post.inputPath) {
        try {
          const fileContent = fs.readFileSync(post.inputPath, 'utf-8');
          const bodyMatch = fileContent.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
          label = (bodyMatch ? bodyMatch[1] : fileContent).replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#*_`>]/g, '').replace(/\n/g, ' ').trim();
        } catch {
          label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      } else {
        label = post.data.title || d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      posts[key].push({
        label,
        url: post.url,
      });
    }

    const sortedYears = Object.keys(years).sort().reverse();

    return styleSheet + sortedYears.map((year) => {
      const offset = Array.from({ length: years[year].offset })
        .map(() => `<div class="${prefix}__box ${prefix}__box--empty"></div>`)
        .join('');

      const days = Array.from({ length: years[year].days }).map((_, i) => {
        const key = `${year}-${i + 1}`;
        const dayPosts = posts[key];
        if (dayPosts && dayPosts.length > 0) {
          const d = new Date(year, 0, i + 1);
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const labelHtml = dayPosts.map(p => `<span class="${prefix}__tooltip-title">${p.label.replace(/</g, '&lt;')}</span>`).join('');
          const href = dayPosts[0].url;
          return `<a class="${prefix}__box ${prefix}__hasPost" href="${href}"><span class="${prefix}__tooltip">${labelHtml}<span class="${prefix}__tooltip-date">${dateStr}</span></span></a>`;
        }
        return `<div class="${prefix}__box"></div>`;
      }).join('');

      return `<div class="${prefix}"><div class="${prefix}__year">${year}</div><div class="${prefix}__months">
        <div>Jan</div><div>Feb</div><div>Mar</div><div>Apr</div><div>May</div><div>Jun</div>
        <div>Jul</div><div>Aug</div><div>Sep</div><div>Oct</div><div>Nov</div><div>Dec</div>
      </div><div class="${prefix}__squares">${offset}${days}</div></div>`;
    }).join('');
  });

  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    outputDir: 'assets/og-images',
    urlPath: '/assets/og-images',
    OgImage: CachedOgImage,
    outputFileSlug: (ogImage) => {
      const hash = crypto.createHash('sha256');
      hash.update(OG_TEMPLATE_VERSION);
      hash.update(JSON.stringify(ogImage.data || {}));
      return hash.digest('hex').substring(0, 8);
    },
    shortcodeOutput: async (ogImage) => `<meta property="og:image" content="https://flohgro.com${await ogImage.outputUrl()}" />`,
    satoriOptions: {
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fs.readFileSync('public/fonts/JetBrainsMono-Regular.ttf'),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'JetBrains Mono',
          data: fs.readFileSync('public/fonts/JetBrainsMono-Bold.ttf'),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  });

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  eleventyConfig.addFilter("isoDate", (dateString) => {
    let dateObj = new Date(dateString);
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-MM-dd');
  });


  eleventyConfig.addFilter("relatedPosts", function (collection, tags, currentUrl, limit) {
    const excludeTags = ["all", "posts", "post", "blog", "now", "drafts-action-directory-feed"];
    const currentTags = (tags || []).filter(tag => excludeTags.indexOf(tag) === -1);
    if (currentTags.length === 0) return [];

    return collection
      .filter(post => post.url !== currentUrl)
      .map(post => {
        const postTags = (post.data.tags || []).filter(tag => excludeTags.indexOf(tag) === -1);
        const shared = currentTags.filter(tag => postTags.includes(tag)).length;
        return { post, shared };
      })
      .filter(item => item.shared > 0)
      .sort((a, b) => b.shared - a.shared || b.post.date - a.post.date)
      .slice(0, limit || 3)
      .map(item => item.post);
  });

  eleventyConfig.addFilter("truncate", function (str, length) {
    if (!str) return "";
    // Remove HTML tags
    const cleanStr = striptags(str);
    // Truncate the string
    if (cleanStr.length <= length) return cleanStr;
    return cleanStr.substring(0, length) + "...";
  });

  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value);
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom", // or "rss", "json"
    outputPath: "/atom.xml",
    collection: {
      name: "limitedBlogPosts",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "FlohGro",
      subtitle: "I code more than I write.",
      base: "https://flohgro.com/",
      author: {
        name: "FlohGro",
        email: "hi@flohgro.com",
      }
    }
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss", // or "rss", "json"
    outputPath: "/rss.xml",
    collection: {
      name: "limitedBlogPosts",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "FlohGro",
      subtitle: "I code more than I write.",
      base: "https://flohgro.com/",
      author: {
        name: "FlohGro",
        email: "hi@flohgro.com",
      }
    }
  });

  // Custom JSON feed with excerpt/socialPost support is in feed-custom.json.njk

  // feed for social posts
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/social-rss.xml",
    collection: {
      name: "socialPosts",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "FlohGro Social Posts",
      subtitle: "Feed for social posts that shall be crossposted to several networks.",
      base: "https://flohgro.com/",
      author: {
        name: "FlohGro",
        email: "hi@flohgro.com",
      }
    }
  });

  // feed for social posts
  eleventyConfig.addPlugin(feedPlugin, {
    type: "json",
    outputPath: "/social-feed.json",
    collection: {
      name: "socialPosts",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "FlohGro Social Posts",
      subtitle: "Feed for social posts that shall be crossposted to several networks.",
      base: "https://flohgro.com/",
      author: {
        name: "FlohGro",
        email: "hi@flohgro.com",
      }
    }
  });
  // feed for quote posts
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/quote-rss.xml",
    collection: {
      name: "quotePosts",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "FlohGro Quote Posts",
      subtitle: "Feed for quote posts that shall be crossposted to several networks.",
      base: "https://flohgro.com/",
      author: {
        name: "FlohGro",
        email: "hi@flohgro.com",
      }
    }
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "json",
    outputPath: "/quote-feed.json",
    collection: {
      name: "quotePosts",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "FlohGro Quote Posts",
      subtitle: "Feed for quote posts that shall be crossposted to several networks.",
      base: "https://flohgro.com/",
      author: {
        name: "FlohGro",
        email: "hi@flohgro.com",
      }
    }
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "json", // or "rss", "json"
    outputPath: "/drafts-action-directory-feed.json",
    collection: {
      name: "draftActionDirectoryFeed",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "FlohGro - Drafts Action Directory Feed",
      subtitle: "These are not (all) my actions, they are the publicly shared ones in the directory.",
      base: "https://flohgro.com/",
      author: {
        name: "FlohGro",
        email: "hi@flohgro.com",
      }
    }
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss", // or "rss", "json"
    outputPath: "/drafts-action-directory-feed-rss.xml",
    collection: {
      name: "draftActionDirectoryFeed",
      limit: 0,
    },
    metadata: {
      language: "en",
      title: "FlohGro - Drafts Action Directory Feed",
      subtitle: "These are not (all) my actions, they are the publicly shared ones in the directory.",
      base: "https://flohgro.com/",
      author: {
        name: "FlohGro",
        email: "hi@flohgro.com",
      }
    }
  });

  // Collect tags from all blogPosts
  eleventyConfig.addCollection("tags", function (collectionApi) {
    let tags = {};
    collectionApi.getAll().forEach(function (item) {
      if (item.data.tags) {
        item.data.tags.forEach(tag => {
          if (!tags[tag]) {
            tags[tag] = [];
          }
          tags[tag].push(item);
        });
      }
    });
    return Array.from(tags);
  });


  eleventyConfig.addCollection("tagslist", function (collectionApi) {
    let tags = new Set();
    collectionApi.getAll().forEach(function (item) {
      if (item.data.tags) {
        item.data.tags.forEach(tag => {
          tags.add(tag);
        });
      }
    });
    let tagsArray = Array.from(tags);
    tagsArray.splice(tagsArray.indexOf("post"), 1);
    return tagsArray.sort();
  });

  // Create the tag pages dynamically
  eleventyConfig.addCollection("tagPages", function (collectionApi) {
    let tagMap = collectionApi.getAll().reduce((acc, post) => {
      if (post.data.tags) {
        post.data.tags.forEach(tag => {
          if (!acc[tag]) {
            acc[tag] = [];
          }
          acc[tag].push(post);
        });
      }
      return acc;
    }, {});
    let pages = [];
    for (let tag in tagMap) {
      pages.push({
        outputPath: `/tags/${tag}/index.html`,
        templateData: {
          tag: tag,
          posts: tagMap[tag]
        }
      });
    }

    return pages;
  });

  return {
    dir: {
      input: ".",            // Use the root directory as input
      includes: "_includes", // Default for reusable components/templates
      data: "_data",         // Default for global data files
      output: "_site",       // Output folder
    },
  };
}

