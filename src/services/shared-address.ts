import crypto from "crypto";

import { Address } from "../models/Address";
import { SharedAddress } from "../models/SharedAddress";

export class ShareAddressService {
  async share(
    addressId: string,
    userId: string,
    expiresInHours: number
  ) {
    const address = await Address.findOne({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();

    expiresAt.setHours(
      expiresAt.getHours() + expiresInHours
    );

    const sharedAddress = await SharedAddress.create({
      token,
      expiresAt,
      addressId,
    });

    return {
      token,
      expiresAt,

      url: `http://localhost:3000/shared/${token}`,
    };
  }

  async getSharedAddress(token: string) {
    const shared = await SharedAddress.findOne({
      where: {
        token,
      },

      include: [
        {
          model: Address,
          as: "address",
        },
      ],
    });

    if (!shared) {
      throw new Error("Shared link not found");
    }

    if (new Date() > shared.expiresAt) {
      throw new Error("Shared link expired");
    }

    return shared;
  }
}