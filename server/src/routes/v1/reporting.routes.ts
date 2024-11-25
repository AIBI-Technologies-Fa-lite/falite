import { Router } from "express";
import {
  getCaseCount,
  getVerificationsCount
} from "../../controllers/reporting/dashboard.controller";

const reportingRouter = Router();

reportingRouter.get("/case", getCaseCount);
reportingRouter.get("/verification", getVerificationsCount);

export default reportingRouter;
