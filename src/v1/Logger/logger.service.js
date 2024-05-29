const { Client, Events, GatewayIntentBits } = require("discord.js");
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
  log() {
    this.client.on("messageCreate", (message) => {
      if (message.author.bot) {
        return;
      }
      if (message.content === "ping") {
        console.log(message);
        message.reply("dm a cuong");
      }
    });
    return this;
  }
  exceptionLog(error) {
    this.client.channels
      .fetch("1245067474458902579")
      .then((channel) => {
        const errorMessage = `
            **Error Occurred!**
            **Status:** ${error.status || 500}
            **Message:** ${error.message || "Internal Server Error"}
            **Stack Trace:** \`\`\`${
              error.stack || "No stack trace available"
            }\`\`\``;
        channel.send(errorMessage);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  static createLoggerService() {
    if (!this.instance) {
      this.instance = new LoggerService();
      this.instance.login();
    }
    return this.instance;
  }
}

module.exports = LoggerService;
