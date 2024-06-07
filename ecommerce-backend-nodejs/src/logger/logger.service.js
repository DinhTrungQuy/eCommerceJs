const { Client, Events, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");
const slashCommand = require("../bot/discord.bot");
const { default: axios } = require("axios");
require("dotenv").config();
class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageTyping,
      ],
    });
    this.client.on("ready", () => {
      console.log(`Connected as ${this.client.user.tag}`);
    });
  }
  login() {
    this.client.login(process.env.DISCORD_BOT_TOKEN);
  }
  async log() {
    this.client.on("messageCreate", (message) => {
      if (message.author.bot) {
        return;
      }
      if (message.content === "ping") {
        message.reply("dm a cuong");
      }
    });
    this.client.on("messageCreate", (msg) => {
      if (msg.content.toLowerCase() == "clear") {
        async function wipe() {
          var msg_size = 100;
          while (msg_size == 100) {
            await msg.channel
              .bulkDelete(100)
              .then((messages) => (msg_size = messages.size))
              .catch(console.error);
          }
          msg.channel.send(`<@${msg.author.id}>\n> ${msg.content}`);
        }
        wipe();
      }
    });
  
  }

  sendRequestInfo(req) {
    this.client.channels
      .fetch("1245067474458902579")
      .then((channel) => {
        const requestInfo = {
          color: 0x3498db, // Blue color
          title: "Request Information",
          fields: [
            {
              name: "Method",
              value: `${req.method}`,
              inline: true,
            },
            {
              name: "URL",
              value: `${req.url}`,
              inline: true,
            },
            {
              name: "Headers",
              value: `\`\`\`json\n${JSON.stringify(
                req.headers,
                null,
                2
              )}\`\`\``,
            },
            {
              name: "Body",
              value: `\`\`\`json\n${
                JSON.stringify(req.body, null, 2) || "No body"
              }\`\`\``,
            },
          ],
          timestamp: new Date(),
        };
        channel.send({ embeds: [requestInfo] });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  exceptionLog(error) {
    this.client.channels
      .fetch("1245067474458902579")
      .then((channel) => {
        const errorMessage = {
          color: 0xff0000,
          title: "Error Occurred!",
          fields: [
            {
              name: "Status",
              value: `${error.status || 500}`,
              inline: true,
            },
            {
              name: "Message",
              value: `${error.message || "Internal Server Error"}`,
              inline: true,
            },
            {
              name: "Stack Trace",
              value: `\`\`\`${error.stack || "No stack trace available"}\`\`\``,
            },
          ],
          timestamp: new Date(),
        };
        channel.send({ embeds: [errorMessage] });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static createLoggerService() {
    if (!this.instance) {
      this.instance = new LoggerService();
      this.instance.login();
      this.instance.log();
    }
    return this.instance;
  }
}

module.exports = LoggerService;
