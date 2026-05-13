import { Request, Response } from "express";
import { AuthService } from "../services/auth";
import { logger } from "../utils/logger";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      logger.info("Login attempt started", { email });

      const data = await authService.login({ email, password });

      logger.info("Login completed successfully", { email });

      return res.json(data);
    } 
    catch (error) {
      logger.warn("Login failed", {
        email,
        error: error instanceof Error ? error.message : "Authentication failed",
      });

      return res.status(401).json({ error: error instanceof Error ? error.message : "Authentication failed" });
    }
  }
}
