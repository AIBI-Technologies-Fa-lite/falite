import { Router } from "express";
import {
  captureLocation,
  getCheckins,
  resetLocation
} from "../../controllers/user/location.controller";
import { roleMiddleware } from "../../middlewares/auth";
const locationRouter = Router();

locationRouter.post("/", roleMiddleware(["OF"]), captureLocation);
locationRouter.post("/reset", roleMiddleware(["ADMIN"]), resetLocation);
locationRouter.get(
  "/checkins",
  roleMiddleware(["CRE", "SUPERVISOR"]),
  getCheckins
);
export default locationRouter;
