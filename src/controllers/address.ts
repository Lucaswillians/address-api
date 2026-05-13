import { Request, Response } from "express";
import { AddressService } from "../services/address";
import { logger } from "../utils/logger";

const addressService = new AddressService();

export class AddressController {
  async create(req: Request, res: Response) {
    try {
      logger.info("Address creation started", { userId: req.user!.id });

      const address = await addressService.create({
        ...req.body,
        userId: req.user!.id,
      });

      logger.info("Address created successfully", {
        userId: req.user!.id,
        addressId: address.id,
      });

      return res.status(201).json(address);
    } 
    catch (error) {
      logger.error("Address creation failed", {
        userId: req.user!.id,
        error:
          error instanceof Error
            ? error.message
            : "Error creating address",
      });

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error creating address",
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const addresses = await addressService.findAll(req.user!.id);

      return res.json(addresses);
    } 
    catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error fetching addresses",
      });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;

    try {
      logger.info("Address update started", {
        userId: req.user!.id,
        addressId: id,
      });

      const address = await addressService.update(id, req.user!.id, req.body);

      logger.info("Address updated successfully", {
        userId: req.user!.id,
        addressId: id,
      });

      return res.json(address);
    } 
    catch (error) {
      logger.error("Address update failed", {
        userId: req.user!.id,
        addressId: id,
        error:
          error instanceof Error
            ? error.message
            : "Error updating address",
      });

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error updating address",
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    try {
      logger.info("Address deletion started", {
        userId: req.user!.id,
        addressId: id,
      });

      const result = await addressService.delete(id, req.user!.id);

      logger.info("Address deleted successfully", {
        userId: req.user!.id,
        addressId: id,
      });

      return res.json(result);
    } 
    catch (error) {
      logger.error("Address deletion failed", {
        userId: req.user!.id,
        addressId: id,
        error:
          error instanceof Error
            ? error.message
            : "Error deleting address",
      });

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error deleting address",
      });
    }
  }
}
