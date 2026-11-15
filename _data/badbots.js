import EleventyFetch from '@11ty/eleventy-fetch';

// Search engines, link previews and AI search/citation bots we want to reach, even though the upstream list blocks them.
const allowed = [
    'Applebot',
    'facebookexternalhit',
    'PetalBot',
    'OAI-SearchBot',
    'Claude-SearchBot',
    'PerplexityBot',
    'DuckAssistBot',
    'ChatGPT-User',
    'Claude-User',
    'Perplexity-User',
].map(name => name.toLowerCase());

function allowBots(robots) {
    return String(robots) // EleventyFetch returns a Buffer on cache hits
        .split('\n')
        .filter(line => {
            const match = line.match(/^User-agent:\s*(.+?)\s*$/i);
            return !match || !allowed.includes(match[1].toLowerCase());
        })
        .join('\n');
}

export default async function() {
    try {
        let url = "https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.txt";

        return EleventyFetch(url, {
            duration: "1w",
            type: "text"
        }).then(allowBots);
    } catch (error) {
        console.log('Error fetching bad bots from github.com/ai-robots-txt/ai.robots.txt:', error);
    }
};
