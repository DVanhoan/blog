import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/:conversationId", protectRoute, sendMessage);
router.get("/:conversationId", protectRoute, getMessages);

export default router;
