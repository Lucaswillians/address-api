import { User } from "../models/User";
import { Address } from "../models/Address";
import { SharedAddress } from "../models/SharedAddress";

export function setupAssociations() {
  User.hasMany(Address, {
    foreignKey: "userId",
    as: "addresses",
  });

  Address.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Address.hasMany(SharedAddress, {
    foreignKey: "addressId",
    as: "shares",
  });

  SharedAddress.belongsTo(Address, {
    foreignKey: "addressId",
    as: "address",
  });
}