import fs from "fs";
import path from "path";
import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

dotenv.config();

export const syncCalendarChanges = async (email: string) => {
  const tokenPath = path.join(__dirname, "../../tokens.json");
  const syncPath = path.join(__dirname, "../../syncTokens.json");

  if (!fs.existsSync(tokenPath)) {
    console.error(`No token file found`);
    return;
  }

  const allTokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  const tokens = allTokens[email];

  if (!tokens) {
    console.error(`No tokens found for ${email}`);
    return;
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  let syncToken: string | undefined;

  if (fs.existsSync(syncPath)) {
    const syncData = JSON.parse(fs.readFileSync(syncPath, "utf-8"));
    syncToken = syncData[email];
  }

  let pageToken: string | undefined = undefined;
  let allEvents: calendar_v3.Schema$Event[] = [];
  let changesFound = 0;

  try {
    do {
      const res = await calendar.events.list({
        calendarId: "primary",
        ...(syncToken ? { syncToken } : { timeMin: new Date().toISOString() }),
        showDeleted: true,
        singleEvents: true,
        maxResults: 250,
        pageToken,
      });

      const events: calendar_v3.Schema$Event[] = res.data.items || [];
      allEvents.push(...events);
      changesFound += events.length;

      for (const event of events) {
        const title = event.summary || "(No Title)";
        const id = event.id;
        const status = event.status;

        if (status === "cancelled") {
          console.log(`Deleted event: "${title}" [${id}]`);
        } else if (event.created === event.updated) {
          console.log(`Created event: "${title}" [${id}]`);
        } else {
          console.log(`Updated event: "${title}" [${id}]`);
        }
      }

      pageToken = res.data.nextPageToken;

      if (!pageToken && res.data.nextSyncToken) {
        let allSyncTokens: Record<string, string> = {};
        if (fs.existsSync(syncPath)) {
          allSyncTokens = JSON.parse(fs.readFileSync(syncPath, "utf-8"));
        }
        allSyncTokens[email] = res.data.nextSyncToken;
        fs.writeFileSync(syncPath, JSON.stringify(allSyncTokens, null, 2));
        console.log(`New syncToken saved for ${email}`);
      }
    } while (pageToken);
    
    const cacheKey = `calendar_events:${email}`;
    await redis.set(cacheKey, allEvents); 
    console.log(`Cached ${allEvents.length} events for ${email} in Redis`);

    console.log(
      ` Sync triggered for ${email} — ${changesFound} changes found`
    );
  } catch (err: any) {
    if (err.response?.status === 410) {
      console.warn(
        `syncToken expired for ${email} — clearing for next full sync`
      );
      if (fs.existsSync(syncPath)) {
        const allSyncTokens = JSON.parse(fs.readFileSync(syncPath, "utf-8"));
        delete allSyncTokens[email];
        fs.writeFileSync(syncPath, JSON.stringify(allSyncTokens, null, 2));
      }
    } else {
      console.error(`Sync failed for ${email}:`, err.message);
    }
  }
};
