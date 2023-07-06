import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import { aichat } from "../controllers/aichat.js";

router.post("/", auth, aichat);

export default router;
