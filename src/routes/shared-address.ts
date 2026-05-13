import { Router } from "express";
import { ShareAddressController } from "../controllers/shared-address";

const router = Router();

const shareAddressController = new ShareAddressController();

router.post("/address/:id/share", shareAddressController.share);
router.get("/shared/:token", shareAddressController.getShared);

export { router as shareAddressRoutes };