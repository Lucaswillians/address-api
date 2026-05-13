import { User } from "../models/User";
import bcrypt from "bcryptjs";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export class UserService {
  async create({ name, email, password }: CreateUserDTO) {
    const userAlreadyExists = await User.findOne({ where: { email } });

    if (userAlreadyExists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return user;
  }

  
  async findAll() {
    const users = await User.findAll();
    
    return users;
  }

  async update(id: string, data: CreateUserDTO) {
    const user = await User.findByPk(id);
  
    if (!user) throw new Error("User not found");

    await user.update(data);
  
    return user;
  }
}