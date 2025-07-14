import { google } from "googleapis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { saveChannelMapping } from "../src/utils/channelMapping";
import { createHash } from "crypto";

dotenv.config();

const userEmail = process.argv[2];

if (!userEmail) {
  console.error("Please provide user email as argument:");
  console.error("   npx ts-node scripts/initWebhook.ts user@example.com");
  process.exit(1);
}

const tokenPath = path.join(__dirname, "../tokens.json");

if (!fs.existsSync(tokenPath)) {
  console.error(
    "No user_tokens.json file found. Please authenticate first."
  );
  process.exit(1);
}

const allTokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
const userTokens = allTokens[userEmail];

if (!userTokens) {
  console.error(
    `No tokens found for ${userEmail}. Please authenticate first.`
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

oauth2Client.setCredentials(userTokens);

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

async function startWatching() {
  try {
    function generateChannelId(userEmail: string) {
      const timestamp = Date.now();
      const emailHash = createHash("sha256")
        .update(userEmail + timestamp)
        .digest("base64")
        .replace(/[^A-Za-z0-9_\-]/g, "") 
        .slice(0, 50); 
      return `${emailHash}_${timestamp}`;
    }

    const channelId = generateChannelId(userEmail);

    console.log(`Setting up webhook for ${userEmail}`);
    console.log(`Channel ID: ${channelId}`);

    const res = await calendar.events.watch({
      calendarId: "primary",
      requestBody: {
        id: channelId,
        type: "web_hook",
        address:
          process.env.WEBHOOK_URL || "https://your-webhook-url.com/webhook",
      },
    });

    saveChannelMapping(channelId, userEmail);

    console.log(`Webhook registered for ${userEmail}:`, res.data);
    console.log(`Expires: ${new Date(Number(res.data.expiration))}`);
  } catch (err: any) {
    if (err.code === 400 && err.message?.includes("not unique")) {
      console.error(
        "Channel ID already exists. This shouldn't happen with timestamp-based IDs."
      );
      console.error("Try running the script again in a few seconds.");
    } else {
      console.error("Failed to register webhook:", err.message || err);
    }
  }
}

startWatching();
