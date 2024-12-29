import { Router } from "express";
import {
  readNotificaton,
  getNotifications,
  getCounts
} from "../../controllers/notification/notification.controller";

const notificationRouter = Router();

notificationRouter.put("/:id", readNotificaton);
notificationRouter.get("/", getNotifications);
notificationRouter.get("/count", getCounts);

export default notificationRouter;
