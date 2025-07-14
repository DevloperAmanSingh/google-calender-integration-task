import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import fs from "fs";
import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const router = express.Router();
router.use(cookieParser());

const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
});

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

router.get("/auth/google", (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
  res.redirect(url);
});

router.get("/auth/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("Missing code");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userinfo = await oauth2.userinfo.get();
    const email = userinfo.data.email;

    if (!email) return res.status(400).send("No email found");

    // Save tokens under email
    const tokenStorePath = path.join(__dirname, "../../tokens.json");
    const currentTokens = fs.existsSync(tokenStorePath)
      ? JSON.parse(fs.readFileSync(tokenStorePath, "utf-8"))
      : {};
    currentTokens[email] = tokens;
    fs.writeFileSync(tokenStorePath, JSON.stringify(currentTokens, null, 2));

    // Set cookie and redirect to frontend
    res.cookie("user_email", email, {
      httpOnly: false, // Allow JavaScript access for frontend authentication
      secure: false, // Use false for development (HTTP), true for production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect("http://localhost:3001"); // your Next.js site
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).send("OAuth failed");
  }
});

export default router;
