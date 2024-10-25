import { Router } from "express";
import { createCase, createVerification, getCases } from "../../controllers/cre/verification.controller";

const verificationRouter = Router();

verificationRouter.post("/", createVerification);
verificationRouter.post("/case", createCase);
verificationRouter.get("/case", getCases);

export default verificationRouter;
