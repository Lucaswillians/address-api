import { Request, Response } from "express";
import { UserService } from "../services/users";
import { logger } from "../utils/logger";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      logger.info("User creation started", { email });

      const user = await userService.create({ name, email, password });

      logger.info("User created successfully", {
        userId: user.id,
        email: user.email,
      });

      return res.status(201).json(user);
    }
    catch (error) {
      logger.error("User creation failed", {
        email,
        error: error instanceof Error ? error.message : "Internal error",
      });

      return res.status(400).json({
        error: error instanceof Error ? error.message : "Internal error",
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const users = await userService.findAll();

      return res.json(users);
    }
    catch (error) {
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const { name, email, password } = req.body;

    try {
      logger.info("User update started", { userId: id, email });

      const user = await userService.update(id, { name, email, password });

      logger.info("User updated successfully", {
        userId: id,
        email: user.email,
      });

      return res.json(user);
    } 
    catch (error) {
      logger.error("User update failed", {
        userId: id,
        email,
        error: error instanceof Error ? error.message : "Internal error",
      });

      return res.status(400).json({
        error: error instanceof Error ? error.message : "Internal error",
      });
    }
  }
}
