import express, { Request, Response } from "express";
const router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  res.send("hello World");
})

export default router;
