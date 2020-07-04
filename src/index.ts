import * as dotenv from "dotenv";
import * as Discord from "discord.js";
import * as fs from "fs";
import * as xml2js from "xml2js";
import fetch from "node-fetch";
import { RedditFeed, Entry, ParsedEntry } from "./templates/RedditFeed";

/**
 * Initial setup
 */
dotenv.config();
const client = new Discord.Client();
const serverName: string = process.env.SERVER_NAME;
const channelName: string = process.env.CHANNEL_NAME;
const cacheFileName: string = process.env.CACHE_FILE_NAME;
const REFRESH_TIME: number = 15 * 60 * 1000;

/**
 * Regex used to test entry title
 */
const customRegex: RegExp = new RegExp("free|100%");

/**
 * Bot setup
 */
client.on("ready", () => {
  const channel = client.guilds.cache
    .find((el) => el.name === serverName)
    .channels.cache.find(
      (el: Discord.GuildChannel) => el.name === channelName && el.type === "text"
    ) as Discord.TextChannel;
  setInterval(() => {
    fetchReddit()
      .then((freebies: ParsedEntry[]) => {
        freebies.forEach((freeb: ParsedEntry) => {
          const formatted = format(freeb);
          channel.send(formatted);
        });
      })
      .catch(console.error);
  }, REFRESH_TIME);
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log("Login event");
});

/**
 * Helper function to format message before sending
 */
function format(str: ParsedEntry): string {
  return `${str.title} : ${str.link}`;
}

function checkFreebie(freeb: Entry): boolean {
  try {
    const rawData = fs.readFileSync(cacheFileName, "utf-8");
    const alreadySentData = rawData.split(",");
    if (alreadySentData.includes(freeb.id[0])) {
      return false;
    } else {
      fs.writeFileSync(cacheFileName, `${rawData},${freeb.id}`);
      return true;
    }
  } catch (e) {
    fs.writeFileSync(cacheFileName, `${freeb.id[0]}`);
    return true;
  }
}

/**
 * Actual fetch of the RSS feed
 */
function fetchReddit(): Promise<Response | ParsedEntry[]> {
  console.log(`Fetching data ${Date.now()}`);
  return fetch(process.env.REDDIT_FEED)
    .then((result) => result.text())
    .then(xml2js.parseStringPromise)
    .then((result: RedditFeed): ParsedEntry[] => {
      return result.feed.entry
        .filter((el: Entry) => checkFreebie(el))
        .map((el: Entry): ParsedEntry => ({ title: el.title[0], link: el.link[0]["$"].href }))
        .filter((el: ParsedEntry) => customRegex.test(el.title.toLowerCase()));
    });
}
