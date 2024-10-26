import { Router } from "express";
import { readNotificaton } from "../../controllers/notification/notification.controller";

const notificationRouter = Router();

notificationRouter.put("/:id", readNotificaton);

export default notificationRouter;
