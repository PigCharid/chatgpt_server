import express from "express";
const router = express.Router();

import { generateCode } from "../controllers/userCodeVerify.js";

router.post("/", generateCode);

export default router;
