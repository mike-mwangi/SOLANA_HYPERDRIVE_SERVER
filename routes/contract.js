import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  create,
  getProjects,
  getProject,
  submit,
  update,
  getPublicProjects,
} from "../controllers/ProjectController.js";
import { createProjectOnchain } from "../utils/interact.js";
import { uploads } from "../middlewares/file.js";

const router = express.Router();

/* READ */
router
  .route("/")
  .get(verifyToken, getProjects)
  .post(verifyToken, uploads, create);

router
  .route("/:id")
  .get(verifyToken, getProject)
  .patch(verifyToken, uploads, update);
router.patch("/submit/:id", verifyToken, submit);
router.route("/public").get(getPublicProjects);

router.post("/create-project-onchain", createProjectOnchain);

// router.put("/:userId", createProjectUploads, editProfile);

export default router;
