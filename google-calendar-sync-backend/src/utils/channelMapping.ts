import fs from "fs";
import path from "path";

const CHANNEL_MAPPING_PATH = path.join(
  __dirname,
  "../../channel_mappings.json"
);

export function saveChannelMapping(channelId: string, userEmail: string) {
  let mappings: Record<string, string> = {};

  if (fs.existsSync(CHANNEL_MAPPING_PATH)) {
    mappings = JSON.parse(fs.readFileSync(CHANNEL_MAPPING_PATH, "utf-8"));
  }

  mappings[channelId] = userEmail;

  fs.writeFileSync(CHANNEL_MAPPING_PATH, JSON.stringify(mappings, null, 2));
  console.log(`Channel mapping saved: ${channelId} -> ${userEmail}`);
}

export function getChannelMapping(channelId: string): string | null {
  if (!fs.existsSync(CHANNEL_MAPPING_PATH)) {
    return null;
  }

  const mappings = JSON.parse(fs.readFileSync(CHANNEL_MAPPING_PATH, "utf-8"));
  return mappings[channelId] || null;
}

export function removeChannelMapping(channelId: string) {
  if (!fs.existsSync(CHANNEL_MAPPING_PATH)) {
    return;
  }

  const mappings = JSON.parse(fs.readFileSync(CHANNEL_MAPPING_PATH, "utf-8"));
  delete mappings[channelId];

  fs.writeFileSync(CHANNEL_MAPPING_PATH, JSON.stringify(mappings, null, 2));
  console.log(`Channel mapping removed: ${channelId}`);
}
