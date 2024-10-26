import { Router } from "express";
import { createEmployee, getEmployees, getEmployeesById, deleteUser } from "../../controllers/user/user.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { upload } from "../../config";
const userRouter = Router();

userRouter.use(roleMiddleware([Role.ADMIN]));
userRouter.post("/", upload.single("document"), createEmployee);
userRouter.get("/", getEmployees);
userRouter.get("/:id", getEmployeesById);
userRouter.delete("/:id", deleteUser);
export default userRouter;
