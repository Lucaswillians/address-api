import { Request, Response } from "express";
import { AddressService } from "../services/address";

const addressService = new AddressService();

export class AddressController {
  async create(req: Request, res: Response) {
    try {
      const address = await addressService.create({
        ...req.body,
        userId: req.user!.id,
      });

      return res.status(201).json(address);
    } 
    catch (error) {
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
    try {
      const id = req.params.id as string;
      const address = await addressService.update(id, req.user!.id, req.body);

      return res.json(address);
    } 
    catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error updating address",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await addressService.delete(id, req.user!.id);

      return res.json(result);
    } 
    catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Error deleting address",
      });
    }
  }
}
