import Router from "express";

import { login } from "../../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.post("/login", login);

export default authRouter;
