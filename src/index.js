// Run dotenv
require("dotenv").config();
const Discord = require("discord.js");
const fetch = require("node-fetch"); // for fetching the feed?
const xml2js = require("xml2js");
const customRegex = new RegExp("free|100%");

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const channel = client.channels.cache.find(el => el.name === "bot-annoucements");
  // setInterval(() => {
    fetchReddit()
      .then((freebies) => {
        freebies.forEach(freeb => {
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

function format(str){
  return `${str.title} : ${str.link}`;
}

function fetchReddit() {
  return fetch(process.env.REDDIT_FEED)
    .then(result => result.text())
    .then(xml2js.parseStringPromise)
    .then(result => {
      return result.feed.entry
        .map(el => ({ title: el.title[0], link: el.link[0]["$"].href }))
        .filter(el => customRegex.test(el.title.toLowerCase()));
    })
}
