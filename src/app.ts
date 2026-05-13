import express from "express";
import cors from "cors";

import { userRoutes } from "./routes/users";
import { authRoutes } from "./routes/auth";
import { addressRoutes } from "./routes/adresss";
import { shareAddressRoutes } from "./routes/shared-address";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/address", addressRoutes);
app.use(shareAddressRoutes);

export default app;