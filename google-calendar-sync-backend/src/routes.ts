import express from "express";
import authRoutes from "./auth/auth";
import eventRoutes from "./calendar/events";
import webhookRoutes from "./calendar/webhook";

const router = express.Router();

router.use("/", authRoutes);
router.use("/", eventRoutes);
router.use("/", webhookRoutes);

export default router;
