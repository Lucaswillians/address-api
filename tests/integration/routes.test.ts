import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const mockAuthLogin = jest.fn();
const mockUserCreate = jest.fn();
const mockUserFindAll = jest.fn();
const mockUserUpdate = jest.fn();
const mockAddressCreate = jest.fn();
const mockAddressFindAll = jest.fn();
const mockAddressUpdate = jest.fn();
const mockAddressDelete = jest.fn();
const mockShareAddress = jest.fn();
const mockGetSharedAddress = jest.fn();

jest.mock("../../src/services/auth", () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: mockAuthLogin,
  })),
}));

jest.mock("../../src/services/users", () => ({
  UserService: jest.fn().mockImplementation(() => ({
    create: mockUserCreate,
    findAll: mockUserFindAll,
    update: mockUserUpdate,
  })),
}));

jest.mock("../../src/services/address", () => ({
  AddressService: jest.fn().mockImplementation(() => ({
    create: mockAddressCreate,
    findAll: mockAddressFindAll,
    update: mockAddressUpdate,
    delete: mockAddressDelete,
  })),
}));

jest.mock("../../src/services/shared-address", () => ({
  ShareAddressService: jest.fn().mockImplementation(() => ({
    share: mockShareAddress,
    getSharedAddress: mockGetSharedAddress,
  })),
}));

jest.mock("../../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

import app from "../../src/app";

describe("API integration routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  function authorizationHeader(userId = "user-id") {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string);

    return `Bearer ${token}`;
  }

  it("creates a user through POST /users", async () => {
    const user = {
      id: "user-id",
      name: "Lucas",
      email: "lucas@example.com",
    };

    mockUserCreate.mockResolvedValue(user);

    const response = await request(app).post("/users").send({
      name: "Lucas",
      email: "lucas@example.com",
      password: "plain-password",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(user);
    expect(mockUserCreate).toHaveBeenCalledWith({
      name: "Lucas",
      email: "lucas@example.com",
      password: "plain-password",
    });
  });

  it("returns unauthorized when login credentials are invalid", async () => {
    mockAuthLogin.mockRejectedValue(new Error("Invalid credentials"));

    const response = await request(app).post("/auth/login").send({
      email: "lucas@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid credentials" });
  });

  it("logs in a user through POST /auth/login", async () => {
    const data = {
      user: {
        id: "user-id",
        email: "lucas@example.com",
      },
      token: "signed-token",
    };

    mockAuthLogin.mockResolvedValue(data);

    const response = await request(app).post("/auth/login").send({
      email: "lucas@example.com",
      password: "plain-password",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(data);
  });

  it("updates a user through PUT /users/:id", async () => {
    const user = {
      id: "user-id",
      name: "Lucas Updated",
      email: "updated@example.com",
    };

    mockUserUpdate.mockResolvedValue(user);

    const response = await request(app).put("/users/user-id").send({
      name: "Lucas Updated",
      email: "updated@example.com",
      password: "new-password",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
    expect(mockUserUpdate).toHaveBeenCalledWith("user-id", {
      name: "Lucas Updated",
      email: "updated@example.com",
      password: "new-password",
    });
  });

  it("requires authentication to create an address", async () => {
    const response = await request(app).post("/address").send({
      street: "Main Street",
      number: "100",
      neighborhood: "Downtown",
      city: "Sao Paulo",
      state: "SP",
      zipCode: "12345-000",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Token not provided" });
  });

  it("creates an address through POST /address", async () => {
    const address = {
      id: "address-id",
      userId: "user-id",
      street: "Main Street",
      number: "100",
      neighborhood: "Downtown",
      city: "Sao Paulo",
      state: "SP",
      zipCode: "12345-000",
    };

    mockAddressCreate.mockResolvedValue(address);

    const response = await request(app)
      .post("/address")
      .set("Authorization", authorizationHeader())
      .send({
        street: "Main Street",
        number: "100",
        neighborhood: "Downtown",
        city: "Sao Paulo",
        state: "SP",
        zipCode: "12345-000",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(address);
    expect(mockAddressCreate).toHaveBeenCalledWith({
      street: "Main Street",
      number: "100",
      neighborhood: "Downtown",
      city: "Sao Paulo",
      state: "SP",
      zipCode: "12345-000",
      userId: "user-id",
    });
  });

  it("updates an address through PUT /address/:id", async () => {
    const address = {
      id: "address-id",
      userId: "user-id",
      city: "Rio de Janeiro",
    };

    mockAddressUpdate.mockResolvedValue(address);

    const response = await request(app)
      .put("/address/address-id")
      .set("Authorization", authorizationHeader())
      .send({ city: "Rio de Janeiro" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(address);
    expect(mockAddressUpdate).toHaveBeenCalledWith(
      "address-id",
      "user-id",
      { city: "Rio de Janeiro" }
    );
  });

  it("deletes an address through DELETE /address/:id", async () => {
    const result = { message: "Address deleted successfully" };

    mockAddressDelete.mockResolvedValue(result);

    const response = await request(app)
      .delete("/address/address-id")
      .set("Authorization", authorizationHeader());

    expect(response.status).toBe(200);
    expect(response.body).toEqual(result);
    expect(mockAddressDelete).toHaveBeenCalledWith("address-id", "user-id");
  });

  it("shares an address through POST /address/:id/share", async () => {
    const shared = {
      token: "share-token",
      expiresAt: new Date("2026-05-12T12:00:00.000Z"),
      url: "http://localhost:3000/shared/share-token",
    };

    mockShareAddress.mockResolvedValue(shared);

    const response = await request(app)
      .post("/address/address-id/share")
      .set("Authorization", authorizationHeader())
      .send({ expiresInHours: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ...shared,
      expiresAt: "2026-05-12T12:00:00.000Z",
    });
    expect(mockShareAddress).toHaveBeenCalledWith(
      "address-id",
      "user-id",
      2
    );
  });
});
