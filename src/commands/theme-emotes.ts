import 'dotenv/config';
import * as fs from 'fs';
import {
  CacheType,
  Guild,
  GuildEmoji,
  GuildEmojiManager,
  Interaction,
} from 'discord.js';

const wait = require('util').promisify(setTimeout);

export enum Theme {
  CHRISTMAS = 'christmas',
  HALLOWEEN = 'halloween',
  DEFAULT = 'default',
}

export async function themeCommand(interaction: Interaction<CacheType>) {
  if (!interaction.isCommand()) throw new Error('');

  const themeStr = interaction.options.getString('theme', true);

  if (!Object.keys(Theme).includes(themeStr))
    throw new Error('Not a valid emote theme');

  const theme = Theme[themeStr as keyof typeof Theme];

  const { guild, channel } = interaction;

  if (!guild || !channel) throw new Error('No Guild or Channel found');

  await replace(guild, theme);
}

export async function replace(guild: Guild, theme: Theme) {
  const directory = `${process.env.BASE_DIR}/${theme.toString()}`;
  // Map of guild emojis
  const guildEmojis: Map<string, GuildEmoji> = await mappedGuildEmoji(guild);
  // Map of themed emojis
  const themedEmojis: Map<string, Buffer> = loadImageFolder(directory);

  const guildEmojiManager: GuildEmojiManager = guild?.emojis;

  const requestDelay = 5000; // 5 Seconds

  for (const [key, value] of themedEmojis.entries()) {
    // Delete the original emote from discord
    await guildEmojis.get(key)?.delete();

    await wait(requestDelay);
    // We know the key exists by this point
    await guildEmojiManager.create(value, key);

    await wait(requestDelay);
  }
}

/**
 * Returns a map containing all emotes belonging to the guild
 * key = emote name, value = GuildEmoji
 * @param guild
 * @returns Map<string, GuildEmoji> emojis
 */
export async function mappedGuildEmoji(guild: Guild | null) {
  // Get all emotes belonging to the current Guild
  const guildEmojis = await guild?.emojis?.fetch();

  // console.log(guildEmojis?.get("416424957661282304")?.name);

  const emojis: Map<string, GuildEmoji> = new Map();

  // Convert from Collection to Map with the name as key instead of ID
  guildEmojis?.forEach((key, _) => {
    key.name && emojis.set(key.name, key);
  });

  console.log(`${emojis.get('Kapp')?.toString()}`);

  return emojis;
}

/**
 * Reads all image files in the specified folder and loads them into a map
 * @param directory
 * @returns Map<string, Buffer> emojiData
 */
export const loadImageFolder = (directory: string) => {
  const dirents = fs.readdirSync(directory, { withFileTypes: true });

  const emojiData: Map<string, Buffer> = new Map();

  const fileNames: string[] = dirents
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

  // FIXME Load image one at a time during emote creation rather than all at once
  // Technically fine for folders with emoji sizes, but could easily lead to a crash
  fileNames.forEach((fileName) => {
    emojiData.set(fileName, fs.readFileSync(fileName));
  });

  return emojiData;
};
