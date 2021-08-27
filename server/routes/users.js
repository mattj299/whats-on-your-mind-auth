import express from "express";

import { signin, signup } from "../controllers/user.js";

const router = express.Router();

// same as posts.js except accesses different routes specified in index.js
router.post("/signin", signin);
router.post("/signup", signup);

export default router;
