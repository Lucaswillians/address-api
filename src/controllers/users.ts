import { Request, Response } from "express";
import { UserService } from "../services/users";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await userService.create({ name, email, password });

      return res.status(201).json(user);
    }
    catch (error) {
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
    try {
      const id = req.params.id as string;

      const { name, email, password } = req.body;

      const user = await userService.update(id, { name, email, password });

      return res.json(user);
    } 
    catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Internal error",
      });
    }
  }
}