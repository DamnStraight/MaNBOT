import 'dotenv/config';

import { Client, Intents } from 'discord.js';
import { getGuildEmotes, loadImageFolder } from './commands/xmas';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'xmas')
	{
		const guild = interaction.guild;

		await getGuildEmotes(guild);

		// TODO
		await interaction.reply('Thank you sir');
	}
})

// Login to Discord with your client's token
client.login(process.env.TOKEN);