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

/**
 * Regex used to test entry title
 */
const customRegex = new RegExp("free|100%");
const serverName = "Tziganii v2";
const channelName = "bot-announcements";

/**
 * Bot setup
 */
client.on("ready", () => {
  const channel = client.guilds.cache
    .find((el) => el.name === serverName)
    .channels.cache.find(
      (el: Discord.GuildChannel) => el.name === channelName && el.type === "text"
    ) as Discord.TextChannel;
  // setInterval(() => {
  fetchReddit()
    .then((freebies: ParsedEntry[]) => {
      freebies.forEach((freeb: ParsedEntry) => {
        const formatted = format(freeb);
        channel.send(formatted);
      });
    })
    .catch(console.error);
  // }, 30 * 1000);
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

/**
 * Actual fetch of the RSS feed
 */
function fetchReddit(): Promise<Response | ParsedEntry[]> {
  return fetch(process.env.REDDIT_FEED)
    .then((result) => result.text())
    .then(xml2js.parseStringPromise)
    .then((result: RedditFeed): ParsedEntry[] => {
      console.log(JSON.stringify(result));
      return result.feed.entry
        .map((el: Entry): ParsedEntry => ({ title: el.title[0], link: el.link[0]["$"].href }))
        .filter((el: ParsedEntry) => customRegex.test(el.title.toLowerCase()));
    });
}
