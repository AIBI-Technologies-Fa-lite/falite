import { Router } from "express";
import {
  createBranch,
  getBranches,
  deleteBranch,
  getAllBranches
} from "../../controllers/user/branch.controller";
import {
  createClient,
  getClients,
  deleteClient
} from "../../controllers/admin/client.controller";
import {
  createProduct,
  getProducts,
  deleteProduct
} from "../../controllers/admin/product.controller";
import { roleMiddleware } from "../../middlewares/auth";
import { Role } from "@prisma/client";
const setupRouter = Router();

setupRouter.use(roleMiddleware([Role.ADMIN]));

setupRouter.post("/branch", createBranch);
setupRouter.get("/branch", getBranches);
setupRouter.get("/branch/all", getAllBranches);
setupRouter.delete("/branch/:id", deleteBranch);

setupRouter.post("/client", createClient);
setupRouter.get("/client", getClients);
setupRouter.delete("/client/:id", deleteClient);

setupRouter.post("/product", createProduct);
setupRouter.get("/product", getProducts);
setupRouter.post("/product/:id", deleteProduct);

export default setupRouter;
