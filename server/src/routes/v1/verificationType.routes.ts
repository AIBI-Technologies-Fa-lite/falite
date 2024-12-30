import { Router } from "express";
import {
  getVerificationTypes,
  createVerificationType,
  deleteVerificationType,
  getAllVerificaitonTypes
} from "../../controllers/verifications/verificationType.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";
const vtRouter = Router();

vtRouter.post("/", roleMiddleware([Role.ADMIN]), createVerificationType);
vtRouter.get("/", roleMiddleware([Role.ADMIN, Role.CRE]), getVerificationTypes);
vtRouter.get("/all", getAllVerificaitonTypes);
vtRouter.delete("/:id", roleMiddleware([Role.ADMIN]), deleteVerificationType);

export default vtRouter;
