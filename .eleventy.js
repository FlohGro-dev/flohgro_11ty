import eleventyNavigationPlugin from '@11ty/eleventy-navigation';

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

export default function (eleventyConfig) {
    // Determine the base URL
    const baseUrl = process.env.ELEVENTY_ENV === "production"
        ? "/11ty_test"
        : "";

    // Add baseUrl as global data
    eleventyConfig.addGlobalData("baseUrl", baseUrl);

    eleventyConfig.addCollection("posts", (collectionApi) => {
        return collectionApi.getFilteredByTag("post").sort((a, b) => {
            return b.date - a.date; // Sort by descending date
        });
    });

    eleventyConfig.addPassthroughCopy("assets")
        .addPassthroughCopy({
            "./public/": "/"
        })
        .addPassthroughCopy("src/js")
        .addPassthroughCopy({ "src/": "/" });

    eleventyConfig.addCollection("limitedPosts", function (collectionApi) {

        let posts = collectionApi.getFilteredByGlob("posts/**/*.md");
        posts.sort((a, b) => {
            return new Date(b.data.date) - new Date(a.data.date);
        });

        return posts.slice(0, 10);
    });

    eleventyConfig.addCollection("latestPost", function (collectionApi) {

        let posts = collectionApi.getFilteredByGlob("posts/**/*.md");
        posts.sort((a, b) => {
            return new Date(b.data.date) - new Date(a.data.date);
        });

        return posts.slice(0, 1);
    });

    eleventyConfig.addCollection("recentPostsWithoutLatest", function (collectionApi) {

        let posts = collectionApi.getFilteredByGlob("posts/**/*.md");
        posts.sort((a, b) => {
            return new Date(b.data.date) - new Date(a.data.date);
        });

        return posts.slice(1, 6);
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
    // Filters
    eleventyConfig.addPlugin(pluginFilters);

    eleventyConfig.addFilter("isoDate", (dateString) => {
        let dateObj = new Date(dateString);
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-MM-dd');
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
            name: "limitedPosts",
            limit: 0,
        },
        metadata: {
            language: "en",
            title: "FlohGro's Blog",
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
            name: "limitedPosts",
            limit: 0,
        },
        metadata: {
            language: "en",
            title: "FlohGro's Blog",
            subtitle: "I code more than I write.",
            base: "https://flohgro.com/",
            author: {
                name: "FlohGro",
                email: "hi@flohgro.com",
            }
        }
    });

    eleventyConfig.addPlugin(feedPlugin, {
        type: "json", // or "rss", "json"
        outputPath: "/feed.json",
        collection: {
            name: "limitedPosts",
            limit: 0,
        },
        metadata: {
            language: "en",
            title: "FlohGro's Blog",
            subtitle: "I code more than I write.",
            base: "https://flohgro.com/",
            author: {
                name: "FlohGro",
                email: "hi@flohgro.com",
            }
        }
    });

    // Collect tags from all posts
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



