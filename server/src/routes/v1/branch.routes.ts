import { Router } from "express";
import { createBranch, getBranches, deleteBranch, getAllBranches } from "../../controllers/admin/branch.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";
const branchRouter = Router();

branchRouter.use(roleMiddleware([Role.ADMIN]));

branchRouter.post("/", createBranch);
branchRouter.get("/", getBranches);
branchRouter.get("/all", getAllBranches);
branchRouter.delete("/:id", deleteBranch);

export default branchRouter;
