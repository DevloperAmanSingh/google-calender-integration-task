import express, { Request, Response } from "express";
import { syncCalendarChanges } from "../sync/sync";
import { getChannelMapping } from "../utils/channelMapping";

const router = express.Router();

router.post("/webhook", async (req: Request, res: Response) => {


  const state = req.header("X-Goog-Resource-State");
  const channelId = req.header("X-Goog-Channel-Id");
  

  if (state === "exists" && channelId) {
    try {
      const userEmail = getChannelMapping(channelId);

      if (userEmail) {
        console.log(`Syncing calendar changes for user: ${userEmail}`);
        await syncCalendarChanges(userEmail);
        console.log(`Sync completed for: ${userEmail}`);
      } else {
        console.log("No user found for channel ID:", channelId);
        console.log(
          "💡 Available mappings:",
          require("fs").readFileSync("./channel_mappings.json", "utf-8")
        );
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  } else {
    console.log('Webhook state is not "exists" or no channel ID');
  }

  res.status(200).end();
});


export default router;
