const { REST, Routes } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "chatgpt",
    description: "Chat with GPT",
  },
];

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);
const slashCommand = async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_BOT_APPLICATION),
      {
        body: commands,
      }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
};

const client = 

module.exports = slashCommand;
