import { Router } from "express";
import {
  getCaseCount,
  getVerificationsCount,
  reporting
} from "../../controllers/reporting/dashboard.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const reportingRouter = Router();
reportingRouter.get("/", roleMiddleware([Role.DIRECTOR]), reporting);
reportingRouter.get("/case", getCaseCount);
reportingRouter.get("/verification", getVerificationsCount);

export default reportingRouter;
