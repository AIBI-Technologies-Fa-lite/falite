import dotenv from "dotenv";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  ENV: process.env.NODE_ENV,
  LOGGER: process.env.NODE_ENV === "development" ? "dev" : "tiny",
  JWT_SECRET: process.env.JWT_SECRET
};

const uploadDir = "./src/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Upload directory
  },
  filename: (req, file, cb) => {
    // Generate a unique identifier for the file and preserve its extension
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }
});
