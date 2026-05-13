import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface AddressAttributes {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  userId: string;
}

interface AddressCreationAttributes
  extends Optional<AddressAttributes, "id"> { }

export class Address
  extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes {
  declare id: string;
  declare street: string;
  declare number: string;
  declare neighborhood: string;
  declare city: string;
  declare state: string;
  declare zipCode: string;
  declare complement?: string;
  declare userId: string;
}

Address.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    neighborhood: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    complement: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "addresses",
  }
);