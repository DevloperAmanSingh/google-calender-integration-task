import express, { Request, Response } from "express";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

router.get("/events", async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies?.user_email;

    if (!userEmail) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const tokenPath = path.join(__dirname, "../../tokens.json");

    if (!fs.existsSync(tokenPath)) {
      return res.status(500).json({ error: "No token file found" });
    }

    const allTokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    const userTokens = allTokens[userEmail];

    if (!userTokens) {
      return res.status(401).json({ error: "No tokens found for user" });
    }

    const oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });

    oauth2Client.setCredentials(userTokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    res.json({
      events,
      userEmail,
    });
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
