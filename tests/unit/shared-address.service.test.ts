import { ShareAddressService } from "../../src/services/shared-address";
import { Address } from "../../src/models/Address";
import { SharedAddress } from "../../src/models/SharedAddress";
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock("../../src/models/Address", () => ({
  Address: {
    findOne: jest.fn(),
  },
}));

jest.mock("../../src/models/SharedAddress", () => ({
  SharedAddress: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

const addressModelMock = Address as jest.Mocked<typeof Address>;
const sharedAddressModelMock = SharedAddress as jest.Mocked<
  typeof SharedAddress
>;

describe("ShareAddressService", () => {
  const service = new ShareAddressService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a shared address link", async () => {
    addressModelMock.findOne.mockResolvedValue({ id: "address-id" } as never);
    sharedAddressModelMock.create.mockResolvedValue({
      id: "shared-address-id",
    } as never);

    const result = await service.share("address-id", "user-id", 2);

    expect(addressModelMock.findOne).toHaveBeenCalledWith({
      where: {
        id: "address-id",
        userId: "user-id",
      },
    });
    expect(sharedAddressModelMock.create).toHaveBeenCalledWith({
      token: expect.any(String),
      expiresAt: expect.any(Date),
      addressId: "address-id",
    });
    expect(result).toEqual({
      token: expect.any(String),
      expiresAt: expect.any(Date),
      url: expect.stringContaining("/shared/"),
    });
  });

  it("throws when sharing a missing address", async () => {
    addressModelMock.findOne.mockResolvedValue(null);

    await expect(
      service.share("missing-address", "user-id", 2)
    ).rejects.toThrow("Address not found");
  });

  it("returns a shared address when the token is valid", async () => {
    const shared = {
      token: "token",
      expiresAt: new Date(Date.now() + 60_000),
    };

    sharedAddressModelMock.findOne.mockResolvedValue(shared as never);

    const result = await service.getSharedAddress("token");

    expect(sharedAddressModelMock.findOne).toHaveBeenCalledWith({
      where: { token: "token" },
      include: [
        {
          model: Address,
          as: "address",
        },
      ],
    });
    expect(result).toBe(shared);
  });

  it("throws when the shared link is expired", async () => {
    sharedAddressModelMock.findOne.mockResolvedValue({
      token: "token",
      expiresAt: new Date(Date.now() - 60_000),
    } as never);

    await expect(service.getSharedAddress("token")).rejects.toThrow(
      "Shared link expired"
    );
  });
});
