import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User";

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async login({ email, password }: LoginDTO) {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("Invalid credentials");
    

    const passwordMatch = await bcrypt.compare( password, user.password );

    if (!passwordMatch) throw new Error("Invalid credentials");


    const token = jwt.sign(
      {
        id: user.id,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: "7d",
      }
    );

    return {
      user,
      token,
    };
  }
}