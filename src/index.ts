import 'dotenv/config';

import { Client, Intents } from 'discord.js';
import { loadImageFolder } from './commands/theme-emotes';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'seasonalemotes')
	{
		const guild = interaction.guild;

		// const originalEmojis = await getGuildEmotes(guild);

		await interaction.channel?.send('heh');
		// TODO
		await interaction.reply('Thank you sir');
	}
})

// Login to Discord with your client's token
client.login(process.env.TOKEN);