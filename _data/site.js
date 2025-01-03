const baseUrl = process.env.ELEVENTY_ENV === "production" ? "/new-site" : "";

export default {
    baseUrl,
};