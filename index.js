import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client, Events, GatewayIntentBits } from "discord.js";
import './keep_alive.js';
const allowedChannelID = "1302490769059221545";

const getData = async (link) => {
  const code = await fetch(link)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return data;
    });
  // console.log(code);
  return code;
};

const checkCode = async (link) => {
  const code = await getData(link);
  // console.log(code);

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Tell me if this code is correct based on syntax and logic (ignore indentation error)? Only reply in this format (Correct: YES ✅ or Correct: NO ❌). If yes, give me the percentage of this code being genearated by an AI model in this format AI generated possiblity: percentage and also give me the time and space complexity but dont give any explanaition.But if the code is wrong just give me the errors in bullet points with the line number.${code}`;

  console.log("Analysing the code .....");
  const responseFromAI = await model.generateContent(prompt);
  // console.log(responseFromAI.response.text());
  return responseFromAI.response.text();
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const quotes = [
  "Software development is a journey. Every bug fixed is a lesson learned.",
  "The best software is the one that meets the needs of its users, not the one with the most features.",
  "Good code is its own best documentation. As you’re about to add a comment, ask yourself, ‘How can I improve the code so that this comment isn’t needed?’",
  "The task of the software developer is to engineer the illusion of simplicity.",
  "It's not a bug – it's an undocumented feature.",
  "Programming isn't about typing, it's about thinking.",
  "Refactoring your code is like cleaning up the kitchen after cooking. Skip it, and everything gets harder.",
  "If debugging is the process of removing software bugs, then programming must be the process of putting them in.",
  "The strength of JavaScript is that you can do anything. The weakness is that you will.",
];

// on message eveent handler
client.on("messageCreate", (msg) => {
  if (msg.channelId != allowedChannelID && msg.content.startsWith("$quotes")) {
    msg.reply("_" + quotes[Math.floor(Math.random() * 9)] + "_");
  }
  if (
    msg.channelId != allowedChannelID &&
    msg.content.startsWith("$list-commands")
  ) {
    msg.reply(
      "1. `$quotes` - These commands gives you some great quotes (obviously programming related) to help you cope with dopmanine crash.\n2. This bot will give you the summary of your answer if you post the link to the raw file of your solution in the _daily-soluion_ channel (make sure to post only the link of the raw file)."
    );
  }
  // for solution based reply
  else {
    const link = msg.content.match(/https?:\/\/[^\s]+/);
    if (
      link != null &&
      link[0].indexOf("raw.githubusercontent.com") > -1 &&
      msg.channelId == allowedChannelID &&
      msg.author.bot == false
    ) {
      console.log(`${msg.author.username} just shared his/her solution`);
      // console.log(link);
      checkCode(link[0]).then((data) => {
        msg.reply("**" + data + "**");
        console.log("####reply sent successfully####");
      });
    }
    if (
      (link == null || link[0].indexOf("raw.githubusercontent.com") <= -1) &&
      msg.channelId == allowedChannelID &&
      msg.author.bot == false
    ) {
      msg.reply(
        "**No sh*t posting in this channel.**\nPlease share the link to the raw github code file !!!!"
      );
    }
  }
});

// event handler when the bot is ready and logged in.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot is Ready! Logged in as ${readyClient.user.tag}`);
});
client.login(process.env.DISCORD_TOKEN);
