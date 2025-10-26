import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Product } from "../entities/Product";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "test_db",
  entities: [User, Product],
  synchronize: process.env.NODE_ENV === "development", // Only in development
  logging: false,
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("TypeORM DataSource has been initialized successfully.");
  } catch (error) {
    console.error("Error during DataSource initialization:", error);
    throw error;
  }
};
