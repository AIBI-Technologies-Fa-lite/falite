import { Router } from "express";
import { createOrgAdmin } from "../../controllers/super/create";

const superRouter = Router();

superRouter.post("/organization", createOrgAdmin);

export default superRouter;
