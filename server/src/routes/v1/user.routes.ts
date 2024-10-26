import { Router } from "express";
import { createEmployee, getEmployees, getEmployeesById, deleteUser, getEmployeeByRole } from "../../controllers/user/user.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { upload } from "../../config";
const userRouter = Router();

userRouter.post("/", roleMiddleware([Role.ADMIN]), upload.single("document"), createEmployee);
userRouter.get("/", roleMiddleware([Role.ADMIN]), getEmployees);
userRouter.get("/role/:role", getEmployeeByRole);
userRouter.get("/:id", roleMiddleware([Role.ADMIN]), getEmployeesById);
userRouter.delete("/:id", roleMiddleware([Role.ADMIN]), deleteUser);
export default userRouter;
