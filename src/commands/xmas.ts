import "dotenv/config";
import * as fs from "fs";
import { Guild, GuildEmoji, GuildEmojiManager } from "discord.js";

enum Theme {
    CHRISTMAS = "christmas",
    HALLOWEEN = "halloween",
    DEFAULT = "default",
}

export const replace = async (guild: Guild, theme: Theme) => {
    const directory = `${process.env.BASE_DIR}/${theme.toString()}`;

    const guildEmojis: Map<string, GuildEmoji> = await mappedGuildEmoji(guild);

    const themedEmojis: Map<string, Buffer> = loadImageFolder(directory);

    const guildManager: GuildEmojiManager = guild?.emojis;

    for (const [key, value] of themedEmojis.entries()) {
        await guildEmojis.get(key)?.delete();

        // We know the key exists by this point
        await guildManager.create(themedEmojis.get(key)!!, key, {});
    }
};

export const mappedGuildEmoji = async (guild: Guild | null) => {
    const guildEmojis = await guild?.emojis?.fetch();

    // console.log(guildEmojis?.get("416424957661282304")?.name);

    const emojis: Map<string, GuildEmoji> = new Map();

    guildEmojis?.forEach((key, val) => {
        key.name && emojis.set(key.name, key);
    });

    console.log(`${emojis.get("Kapp")?.toString()}`);

    return emojis;
};

export const loadImageFolder = (directory: string) => {
    const dirents = fs.readdirSync(directory, { withFileTypes: true });

    const emojiData: Map<string, Buffer> = new Map();

    const fileNames: string[] = dirents
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);

    fileNames.forEach((fileName) => {
        emojiData.set(fileName, fs.readFileSync(fileName));
    });

    return emojiData;
};
