import "dotenv/config";

import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

if (process.env.TOKEN === undefined)
  throw new Error("Discord bot token not set");

if (process.env.CLIENT_ID === undefined)
  throw new Error("Client ID not set");

if (process.env.GUILD_ID === undefined)
  throw new Error("Guild ID not set");

const commands = [
    new SlashCommandBuilder()
        .setName("emotetheme")
        .setDescription("Replace emotes with xmas theme")
        .addStringOption(option =>
            option.setName("theme").setDescription("Choose a seasonal theme")
        ),
].map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

rest.put(
    Routes.applicationGuildCommands(
        process.env.CLIENT_ID!!,
        process.env.GUILD_ID!!
    ),
    { body: commands }
)
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
