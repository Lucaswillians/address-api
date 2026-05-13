import { Address } from "../models/Address";
import { User } from "../models/User";

interface CreateAddressDTO {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  userId: string;
}

export class AddressService {
  async create(data: CreateAddressDTO) {
    const addressExists = await Address.findOne({
      where: {
        zipCode: data.zipCode,
        userId: data.userId,
      },
    });

    if (addressExists) {
      throw new Error("Address already exists for this user");
    }

    const address = await Address.create(data);

    return address;
  }

  async findAll(userId: string) {
    return await Address.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",

          attributes: ["id", "name", "email"],
        },
      ],
    });
  }

  async update(id: string, userId: string, data: Partial<CreateAddressDTO>) {
    const address = await Address.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!address) throw new Error("Address not found");

    await address.update({
      ...data,
      userId,
    });

    return address;
  }

  async delete(id: string, userId: string) {
    const address = await Address.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!address) throw new Error("Address not found");

    await address.destroy();

    return { message: "Address deleted successfully" };
  }
}
