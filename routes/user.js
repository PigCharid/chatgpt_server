import express from "express";
const router = express.Router();

import { signin, signup, updataprofile } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/updataprofile", updataprofile);

export default router;
