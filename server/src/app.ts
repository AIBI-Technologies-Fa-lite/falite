import express, { NextFunction, Request, Response } from "express";

import { config } from "./config";

import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import path from "path";

import router from "./routes";
import { error } from "console";
import { apiResponse } from "./utils/response";

// Middleware to set up CORS
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin) return callback(null, true);

    // Here you could specify the allowed origins, or just allow all for now
    callback(null, true);
  },
  credentials: true // Enable credentials (cookies, authorization headers, etc.)
};

const app = express();

app.set("port", config.PORT);
app.use(morgan(config.LOGGER));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "UP",
    uptime: process.uptime(),
    message: "Health check successful",
    timestamp: new Date()
  });
});

app.use("/api", router);

export default app;
