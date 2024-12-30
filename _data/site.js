const baseUrl = process.env.ELEVENTY_ENV === "production" ? "/11ty_test" : "";

export default {
    baseUrl,
};