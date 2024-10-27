import { Router } from "express";
import { createVerification, getVerifications } from "../../controllers/verifications/verification.controller";
import { createCase, getCases, getCaseById } from "../../controllers/verifications/case.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { upload } from "../../config";

const verificationRouter = Router();

verificationRouter.post("/", roleMiddleware([Role.CRE]), upload.array("files"), createVerification);
verificationRouter.get("/", roleMiddleware([Role.ADMIN, Role.OF, Role.SUPERVISOR]), getVerifications);
verificationRouter.post("/case", roleMiddleware([Role.CRE]), createCase);
verificationRouter.get("/case", roleMiddleware([Role.SUPERVISOR, Role.CRE]), getCases);
verificationRouter.get("/case/:id", roleMiddleware([Role.CRE, Role.SUPERVISOR]), getCaseById);

export default verificationRouter;
