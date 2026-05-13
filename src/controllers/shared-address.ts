import { Request, Response } from "express";
import { ShareAddressService } from "../services/shared-address";
import { logger } from "../utils/logger";

const shareAddressService = new ShareAddressService();

export class ShareAddressController {
  async share(req: Request, res: Response) {
    const id = req.params.id as string;
    const { expiresInHours } = req.body;

    try {
      logger.info("Address sharing started", {
        userId: req.user!.id,
        addressId: id,
        expiresInHours,
      });

      const result = await shareAddressService.share(
        id,
        req.user!.id,
        expiresInHours
      );

      logger.info("Address shared successfully", {
        userId: req.user!.id,
        addressId: id,
        expiresAt: result.expiresAt,
      });

      return res.json(result);
    } catch (error) {
      logger.error("Address sharing failed", {
        userId: req.user!.id,
        addressId: id,
        error:
          error instanceof Error
            ? error.message
            : "Error sharing address",
      });

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error sharing address",
      });
    }
  }

  async getShared(req: Request, res: Response) {
    try {
      const token = req.params.token as string;

      const result =
        await shareAddressService.getSharedAddress(
          token
        );

      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error fetching shared address",
      });
    }
  }
}
