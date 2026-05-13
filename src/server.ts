import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { sequelize } from "./database";

import "./models/User";
import "./models/Address";

import { setupAssociations } from "./database/associations";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();

    console.log("Database connected");

    setupAssociations();

    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } 
  catch (error) {
    console.error("Database error:", error);
  }
}

start();