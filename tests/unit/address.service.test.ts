import { AddressService } from "../../src/services/address";
import { Address } from "../../src/models/Address";
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock("../../src/models/Address", () => ({
  Address: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("../../src/models/User", () => ({
  User: {},
}));

const addressModelMock = Address as jest.Mocked<typeof Address>;

describe("AddressService", () => {
  const service = new AddressService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an address when it does not exist for the user", async () => {
    const address = { id: "address-id", zipCode: "12345-000" };

    addressModelMock.findOne.mockResolvedValue(null);
    addressModelMock.create.mockResolvedValue(address as never);

    const result = await service.create({
      street: "Main Street",
      number: "100",
      neighborhood: "Downtown",
      city: "Sao Paulo",
      state: "SP",
      zipCode: "12345-000",
      userId: "user-id",
    });

    expect(addressModelMock.findOne).toHaveBeenCalledWith({
      where: {
        zipCode: "12345-000",
        userId: "user-id",
      },
    });
    expect(result).toBe(address);
  });

  it("throws when creating a duplicate address for the user", async () => {
    addressModelMock.findOne.mockResolvedValue({ id: "address-id" } as never);

    await expect(
      service.create({
        street: "Main Street",
        number: "100",
        neighborhood: "Downtown",
        city: "Sao Paulo",
        state: "SP",
        zipCode: "12345-000",
        userId: "user-id",
      })
    ).rejects.toThrow("Address already exists for this user");
  });

  it("updates an address that belongs to the user", async () => {
    const address = {
      id: "address-id",
      update: jest.fn().mockResolvedValue(undefined),
    };

    addressModelMock.findOne.mockResolvedValue(address as never);

    const result = await service.update("address-id", "user-id", {
      city: "Rio de Janeiro",
    });

    expect(addressModelMock.findOne).toHaveBeenCalledWith({
      where: {
        id: "address-id",
        userId: "user-id",
      },
    });
    expect(address.update).toHaveBeenCalledWith({
      city: "Rio de Janeiro",
      userId: "user-id",
    });
    expect(result).toBe(address);
  });

  it("deletes an address that belongs to the user", async () => {
    const address = {
      id: "address-id",
      destroy: jest.fn().mockResolvedValue(undefined),
    };

    addressModelMock.findOne.mockResolvedValue(address as never);

    const result = await service.delete("address-id", "user-id");

    expect(address.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: "Address deleted successfully" });
  });
});
