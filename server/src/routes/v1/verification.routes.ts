import { Router } from "express";
import { createCase } from "../../controllers/cre/verification.controller";

const verificationRouter = Router();

verificationRouter.post("/case", createCase);

export default verificationRouter;
