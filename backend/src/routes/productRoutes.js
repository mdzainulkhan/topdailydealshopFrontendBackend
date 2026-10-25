
import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public read-only endpoints
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin-only write endpoints
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
