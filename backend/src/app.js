
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";


const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: "Affiliate Store API is running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.use("/api/products", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database unavailable",
    });
  }

  next();
});

app.use("/api/products", productRoutes);

app.use("/api/categories", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database unavailable",
    });
  }

  next();
});

app.use("/api/categories", categoryRoutes);
app.use("/api/admin/auth", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database unavailable",
    });
  }

  next();
});

app.use("/api/admin/auth", adminAuthRoutes);
export default app;
