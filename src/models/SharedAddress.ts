import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface SharedAddressAttributes {
  id: string;
  token: string;
  expiresAt: Date;
  addressId: string;
}

interface SharedAddressCreationAttributes
  extends Optional<SharedAddressAttributes, "id"> { }

export class SharedAddress
  extends Model<
    SharedAddressAttributes,
    SharedAddressCreationAttributes
  >
  implements SharedAddressAttributes {
  declare id: string;
  declare token: string;
  declare expiresAt: Date;
  declare addressId: string;
}

SharedAddress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "shared_addresses",
  }
);