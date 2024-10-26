import { Router } from "express";
import { createCase, createVerification, getCases, getCaseById } from "../../controllers/verifications/verification.controller";

const verificationRouter = Router();

verificationRouter.post("/", createVerification);
verificationRouter.post("/case", createCase);
verificationRouter.get("/case", getCases);
verificationRouter.get("/case/:id", getCaseById);

export default verificationRouter;
