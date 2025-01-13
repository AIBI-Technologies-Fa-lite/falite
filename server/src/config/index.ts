import dotenv from "dotenv";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  ENV: process.env.NODE_ENV,
  LOGGER: process.env.NODE_ENV === "development" ? "dev" : "tiny",
  JWT_SECRET: process.env.JWT_SECRET
};

const storage = new Storage({ projectId: process.env.PROJECT_ID, keyFilename: process.env.KEY_FILE });
const bucketName = "fa_lite_covert";
export const bucket = storage.bucket(bucketName);

export const upload = multer({ storage: multer.memoryStorage() });
export * from "./mapbox";
