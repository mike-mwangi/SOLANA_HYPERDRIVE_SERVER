import express from "express";
import {
  login,
  forgotPassword,
  resetPassword,
  register,
  refreshToken,
  logout,
  changePassword,
} from "../controllers/AuthController.js";
import {
  verifyEmail,
  resendVerificationLink,
} from "../controllers/VerifyEmailController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/user/verify/:id/:token", verifyEmail);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);
router.post("/resend-link", resendVerificationLink);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.put("/change-password", verifyToken, changePassword);

// router.get('/resetPassword/:resetToken', (req, res) => {
//     res.render('resetPassword', { resetToken: req.params.resetToken });
// });

export default router;
