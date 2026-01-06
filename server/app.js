import express from "express";
import { config } from 'dotenv';
config({ path: "./config/config.env" });

import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";

import authRouter from "./router/authRoutes.js"
import studentRouter from "./router/studentsRoutes.js"
import examRouter from "./router/examRoutes.js"
import admitionRouter from "./router/admitionRotes.js"
import adminRouter from "./router/adminRouts.js"

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://otp-markaz-zdfr.vercel.app",
      "https://otp-markaz.vercel.app",
      "https://otp-markaz-student.vercel.app",
      "https://otp-markaz-deshboard.vercel.app",
      "https://otp-markaz-admin.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5176",
      process.env.FRONTEND_URL,
      process.env.DASHBOARD_URL
    ];

    // allow requests with no origin (Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  tempFileDir: "./uploads",
  useTempFiles: true
}));


// FOR BEVK 
app.get("/", (req, res) => {
  res.send("OTP Markaz Backend is running... 🚀");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/exam", examRouter);
app.use("/api/v1/admition", admitionRouter);
app.use("/api/v1/admin", adminRouter);

createTables();

app.use(errorMiddleware);

export default app;