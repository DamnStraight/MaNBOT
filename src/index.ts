import 'dotenv/config';

import { Client, Intents } from 'discord.js';
import { themeCommand } from './commands/theme-emotes';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'seasonalemotes') {
    await interaction.reply('Thank you sir');

    await themeCommand(interaction);
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
