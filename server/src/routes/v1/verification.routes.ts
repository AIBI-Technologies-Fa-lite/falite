import { Router } from "express";
import { createCase, createVerification } from "../../controllers/cre/verification.controller";

const verificationRouter = Router();

verificationRouter.post("/", createVerification);
verificationRouter.post("/case", createCase);

export default verificationRouter;
