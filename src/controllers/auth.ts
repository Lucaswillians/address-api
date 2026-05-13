import { Request, Response } from "express";
import { AuthService } from "../services/auth";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await authService.login({ email, password });

      return res.json(data);
    } 
    catch (error) {
      return res.status(401).json({ error: error instanceof Error ? error.message : "Authentication failed" });
    }
  }
}