import { Router } from "express";
import { getVerificationTypes, createVerificationType, deleteVerificationType } from "../../controllers/verifications/verificationType.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";
const vtRouter = Router();

vtRouter.use(roleMiddleware([Role.ADMIN]));

vtRouter.post("/", createVerificationType);
vtRouter.get("/", getVerificationTypes);
vtRouter.delete("/:id", deleteVerificationType);

export default vtRouter;
