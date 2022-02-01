import "dotenv/config";
import * as fs from "fs";
import { Guild, GuildEmoji, Collection } from "discord.js";

export const getGuildEmotes = async (guild: Guild | null) => {
    const emojiManager = guild?.emojis;
    const guildEmojis = await emojiManager?.fetch();

    console.log(guildEmojis?.get("416424957661282304")?.name);

    const emojis: Map<string, GuildEmoji> = new Map();

    guildEmojis?.forEach((key, val) => {
        key.name && emojis.set(key.name, key);
        console.log(`${key.name} ${val}`);
    });

    return emojis;
};

export const loadImageFolder = (dir: string) => {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });

    const map: Map<string, Buffer> = new Map();

    const fileNames: string[] = dirents
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);

    fileNames.forEach((fileName) => {
        map.set(fileName, fs.readFileSync(fileName));
    });

    return fileNames;
};
