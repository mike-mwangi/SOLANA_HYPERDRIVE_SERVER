import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  create,
  getRegistries,
  getRegistry,
  submit,
  update,
} from "../controllers/RegistryController.js";
import { uploads } from "../middlewares/file.js";
import { getProject } from "../controllers/ProjectController.js";

const router = express.Router();

/* READ */
router
  .route("/")
  .get(verifyToken, getRegistries)
  .post(verifyToken, uploads, create);

router
  .route("/:id")
  .get(verifyToken, getRegistry)
  .patch(verifyToken, uploads, update);
router.patch("/submit/:id", verifyToken, submit);




// router.put("/:userId", createProjectUploads, editProfile);

export default router;
