

import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from 'mongoose';
import 'dotenv/config';

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import authenticate from "./midalwars/authenticate.js";
import upload from "./midalwars/upload.js";
import authControllers from "./controllers/authControllers.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.patch("/users/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatar);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const { DB_HOST } = process.env;
mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    });
  }).catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
