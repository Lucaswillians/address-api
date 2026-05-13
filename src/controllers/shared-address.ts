import { Request, Response } from "express";
import { ShareAddressService } from "../services/shared-address";

const shareAddressService = new ShareAddressService();

export class ShareAddressController {
  async share(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const { expiresInHours } = req.body;

      const result = await shareAddressService.share(
        id,
        req.user!.id,
        expiresInHours
      );

      return res.json(result);
    } catch (error) {
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