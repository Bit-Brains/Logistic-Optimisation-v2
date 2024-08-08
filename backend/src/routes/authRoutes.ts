import express, { Request, Response } from "express";
import { CustomerSignup, login } from "../controllers/authControllers"
const router = express.Router();

router.post("/login", login);
router.post("/custSignup", CustomerSignup);

export default router;
