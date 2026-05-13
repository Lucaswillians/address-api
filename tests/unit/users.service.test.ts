import bcrypt from "bcryptjs";
import { UserService } from "../../src/services/users";
import { User } from "../../src/models/User";
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock("../../src/models/User", () => ({
  User: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

const userModelMock = User as jest.Mocked<typeof User>;
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

describe("UserService", () => {
  const service = new UserService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user with a hashed password", async () => {
    const user = {
      id: "user-id",
      name: "Lucas",
      email: "lucas@example.com",
      password: "hashed-password",
    };

    userModelMock.findOne.mockResolvedValue(null);
    bcryptMock.hash.mockResolvedValue("hashed-password" as never);
    userModelMock.create.mockResolvedValue(user as never);

    const result = await service.create({
      name: "Lucas",
      email: "lucas@example.com",
      password: "plain-password",
    });

    expect(userModelMock.findOne).toHaveBeenCalledWith({
      where: { email: "lucas@example.com" },
    });
    expect(bcryptMock.hash).toHaveBeenCalledWith("plain-password", 10);
    expect(userModelMock.create).toHaveBeenCalledWith({
      name: "Lucas",
      email: "lucas@example.com",
      password: "hashed-password",
    });
    expect(result).toBe(user);
  });

  it("does not create a user when the email already exists", async () => {
    userModelMock.findOne.mockResolvedValue({ id: "existing-user" } as never);

    await expect(
      service.create({
        name: "Lucas",
        email: "lucas@example.com",
        password: "plain-password",
      })
    ).rejects.toThrow("User already exists");

    expect(userModelMock.create).not.toHaveBeenCalled();
  });

  it("updates an existing user", async () => {
    const user = {
      id: "user-id",
      email: "old@example.com",
      update: jest.fn().mockResolvedValue(undefined),
    };

    userModelMock.findByPk.mockResolvedValue(user as never);

    const result = await service.update("user-id", {
      name: "Lucas",
      email: "new@example.com",
      password: "new-password",
    });

    expect(user.update).toHaveBeenCalledWith({
      name: "Lucas",
      email: "new@example.com",
      password: "new-password",
    });
    expect(result).toBe(user);
  });

  it("throws when updating a missing user", async () => {
    userModelMock.findByPk.mockResolvedValue(null);

    await expect(
      service.update("missing-user", {
        name: "Lucas",
        email: "lucas@example.com",
        password: "plain-password",
      })
    ).rejects.toThrow("User not found");
  });
});
