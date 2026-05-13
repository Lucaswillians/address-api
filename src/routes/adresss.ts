import { Router } from "express";
import { AddressController } from "../controllers/address";
import { authGuard } from "../middlewares/authGuard";

const router = Router();

const addressController = new AddressController();

router.use(authGuard);

router.post("/", addressController.create);
router.get("/", addressController.findAll);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.delete);

export { router as addressRoutes };
