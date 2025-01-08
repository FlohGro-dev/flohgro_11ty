import { DateTime } from "luxon";

export default function (eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter('currentYear', () => {
		return new Date().getFullYear();
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts", "post", "blog", "drafts-action-directory-feed"].indexOf(tag) === -1);
	});

	// Helper function for date suffixes
	const nth = (d) => {
		if (d > 3 && d < 21) return "th";
		switch (d % 10) {
			case 1: return "st";
			case 2: return "nd";
			case 3: return "rd";
			default: return "th";
		}
	};

	eleventyConfig.addFilter("postDate", (dateObj) => {
		const d = DateTime.fromJSDate(dateObj).setZone("Europe/Berlin");
		return `${d.toFormat("d")}${nth(d.day)} ${d.toFormat("LLLL yyyy")}`;
	});

	eleventyConfig.addFilter("postIsoDate", (dateObj) => {
		const d = DateTime.fromJSDate(dateObj).setZone("Europe/Berlin");
		return `${d.toFormat("yyyy-MM-dd")}`;
	});


	eleventyConfig.addFilter("postTime", (dateObj) => {
		return DateTime.fromJSDate(dateObj).setZone("Europe/Berlin").toFormat("HH:mm");
	});

};
