import { Router } from "express";
import { captureLocation } from "../../controllers/user/location.controller";
import { roleMiddleware } from "../../middlewares/auth";
const locationRouter = Router();

locationRouter.post("/", roleMiddleware(["OF"]), captureLocation);

export default locationRouter;
