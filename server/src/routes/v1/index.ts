import { Router } from "express";

import { verifyJWT } from "../../middlewares/auth";

import superRouter from "./super.routes";
import authRouter from "./auth.routes";
import branchRouter from "./branch.routes";
import userRouter from "./user.routes";
import vtRouter from "./verificationType.routes";

const v1Router = Router();

v1Router.use("/super", superRouter);
v1Router.use("/auth", authRouter);

v1Router.use(verifyJWT as any);

v1Router.use("/branch", branchRouter);
v1Router.use("/user", userRouter);
v1Router.use("/vt", vtRouter);

export default v1Router;
