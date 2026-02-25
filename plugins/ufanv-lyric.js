"use strict";
const axios = require("axios");
const cheerio = require("cheerio");

async function search(query, page, type) {
    if (type !== "lyric") {
        return;
    }
    const html = (await axios.get("https://www.ufanv.cn/lyric/search", {
        params: {
            wd: query,
            type: "song",
            page: page || 1,
        },
    })).data;
    const $ = cheerio.load(html);
    const data = [];
    $("ul.search-result li a").each((_, el) => {
        const title = $(el).text().trim();
        if (!title) return;
        const href = $(el).attr("href");
        if (!href) return;
        const id = new URL(href, "https://www.ufanv.cn").href;
        data.push({
            title,
            artist: "",
            album: "",
            id,
        });
    });
    return {
        isEnd: true,
        data,
    };
}

async function getLyric(musicItem) {
    const detail = (await axios.get(musicItem.id)).data;
    const $ = cheerio.load(detail);
    const rawLrc = $("#lyrics-lyric").text() || $("#lyrics-txt").text();
    return {
        rawLrc: rawLrc.trim(),
    };
}

module.exports = {
    platform: "Ufanv歌词网",
    version: "0.1.0",
    srcUrl: "https://www.ufanv.cn/lyric",
    cacheControl: "no-store",
    supportedSearchType: ["lyric"],
    search,
    getLyric,
};
