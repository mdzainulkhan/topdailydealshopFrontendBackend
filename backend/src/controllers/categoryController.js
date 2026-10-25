import Product from "../models/Product.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct(
      "category",
      {
        status: "published",
      }
    );

    categories.sort((a, b) =>
      a.localeCompare(b)
    );

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "Get categories error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};