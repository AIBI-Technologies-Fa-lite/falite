import { Router } from "express";
import { readNotificaton, getNotifications } from "../../controllers/notification/notification.controller";

const notificationRouter = Router();

notificationRouter.put("/:id", readNotificaton);
notificationRouter.get("/", getNotifications);

export default notificationRouter;
