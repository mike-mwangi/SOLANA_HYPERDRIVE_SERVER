import express from "express";
import { verifyToken } from "../middlewares/auth.js";
// import { createProjectUploads } from "../middlewares/file.middleware.js";
import { getUser, editProfile } from "../controllers/UserController.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);

// router.put("/:userId", createProjectUploads, editProfile);

export default router;
