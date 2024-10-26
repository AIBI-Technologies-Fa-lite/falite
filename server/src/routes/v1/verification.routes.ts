import { Router } from "express";
import { createVerification, getCases, getCaseById } from "../../controllers/verifications/verification.controller";
import { createCase } from "../../controllers/verifications/case.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const verificationRouter = Router();

verificationRouter.post("/", createVerification);
verificationRouter.post("/case", roleMiddleware([Role.CRE]), createCase);
verificationRouter.get("/case", roleMiddleware([Role.SUPERVISOR, Role.CRE]), getCases);
verificationRouter.get("/case/:id", roleMiddleware([Role.CRE, Role.SUPERVISOR]), getCaseById);

export default verificationRouter;
