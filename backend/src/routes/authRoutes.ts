import express, { Request, Response } from "express";
import { CustomerSignup, login, sendOTP } from "../controllers/authControllers"
const router = express.Router();

router.post("/login", login);
router.get("/otp", sendOTP)
router.post("/custSignup", CustomerSignup);

export default router;
