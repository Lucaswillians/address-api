import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "../../src/services/auth";
import { User } from "../../src/models/User";
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock("../../src/models/User", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const userModelMock = User as jest.Mocked<typeof User>;
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;
const jwtMock = jwt as jest.Mocked<typeof jwt>;

describe("AuthService", () => {
  const service = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("returns a user and token when credentials are valid", async () => {
    const user = {
      id: "user-id",
      email: "lucas@example.com",
      password: "hashed-password",
    };

    userModelMock.findOne.mockResolvedValue(user as never);
    bcryptMock.compare.mockResolvedValue(true as never);
    jwtMock.sign.mockReturnValue("signed-token" as never);

    const result = await service.login({
      email: "lucas@example.com",
      password: "plain-password",
    });

    expect(userModelMock.findOne).toHaveBeenCalledWith({
      where: { email: "lucas@example.com" },
    });
    expect(bcryptMock.compare).toHaveBeenCalledWith(
      "plain-password",
      "hashed-password"
    );
    expect(jwtMock.sign).toHaveBeenCalledWith(
      { id: "user-id" },
      "test-secret",
      { expiresIn: "7d" }
    );
    expect(result).toEqual({ user, token: "signed-token" });
  });

  it("throws when the user is not found", async () => {
    userModelMock.findOne.mockResolvedValue(null);

    await expect(
      service.login({
        email: "missing@example.com",
        password: "plain-password",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("throws when the password does not match", async () => {
    userModelMock.findOne.mockResolvedValue({
      id: "user-id",
      password: "hashed-password",
    } as never);
    bcryptMock.compare.mockResolvedValue(false as never);

    await expect(
      service.login({
        email: "lucas@example.com",
        password: "wrong-password",
      })
    ).rejects.toThrow("Invalid credentials");
  });
});
