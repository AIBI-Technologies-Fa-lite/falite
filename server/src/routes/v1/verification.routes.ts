import { Router } from "express";
import {
  createVerification,
  getVerifications,
  getVerificationById,
  ofResponse,
  submitVerification,
  reopenVerification,
  getBillingVerifications,
  markUntracable,
  markBilling,
  makrkWorking
} from "../../controllers/verifications/verification.controller";
import {
  createCase,
  getCases,
  getCaseById,
  closeCase,
  markCompleted,
  reworkCase
} from "../../controllers/verifications/case.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { upload } from "../../config";

const verificationRouter = Router();

verificationRouter.post(
  "/",
  roleMiddleware([Role.CRE]),
  upload.array("files"),
  createVerification
);
verificationRouter.get(
  "/",
  roleMiddleware([Role.ADMIN, Role.OF, Role.SUPERVISOR, Role.ACCOUNTS]),
  getVerifications
);
verificationRouter.put(
  "/reopen/:id",
  roleMiddleware([Role.SUPERVISOR, Role.CRE]),
  reopenVerification
);
verificationRouter.put("/mark/:id", roleMiddleware([Role.OF]), makrkWorking);
verificationRouter.put("/of/:id", roleMiddleware([Role.OF]), ofResponse);
verificationRouter.post(
  "/submit",
  upload.array("files"),
  roleMiddleware([Role.OF]),
  submitVerification
);
verificationRouter.post("/ut", roleMiddleware([Role.OF]), markUntracable);
verificationRouter.get(
  "/billing",
  roleMiddleware([Role.ACCOUNTS]),
  getBillingVerifications
);
verificationRouter.put(
  "/billing/:id",
  roleMiddleware([Role.ACCOUNTS]),
  markBilling
);
verificationRouter.post("/case", roleMiddleware([Role.CRE]), createCase);
verificationRouter.get(
  "/case",
  roleMiddleware([Role.SUPERVISOR, Role.CRE]),
  getCases
);
verificationRouter.get(
  "/case/:id",
  roleMiddleware([Role.CRE, Role.SUPERVISOR]),
  getCaseById
);
verificationRouter.put("/case/:id", roleMiddleware([Role.CRE]), closeCase);
verificationRouter.put(
  "/case/rework/:id",
  roleMiddleware([Role.SUPERVISOR]),
  reworkCase
);
verificationRouter.put(
  "/case/complete/:id",
  roleMiddleware([Role.SUPERVISOR]),
  markCompleted
);
verificationRouter.get("/:id", getVerificationById);
export default verificationRouter;
