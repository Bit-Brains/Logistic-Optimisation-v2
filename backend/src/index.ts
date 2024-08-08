import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";
dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Port is listening at ${port}`);
});


