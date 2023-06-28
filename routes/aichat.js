import express from "express";
const router = express.Router();

import { aichat } from "../controllers/aichat.js";

router.post("/", aichat);

export default router;