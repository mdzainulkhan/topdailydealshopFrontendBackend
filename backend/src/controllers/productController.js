import Product from "../models/Product.js";

/**
 * GET /api/products
 *
 * Get products with search, category,
 * sorting and pagination.
 */
const getBestPriceExpression = () => ({
  $min: {
    $filter: {
      input: [
        {
          $cond: [
            {
              $and: [
                { $eq: ["$amazon.available", true] },
                { $gt: ["$amazon.price", 0] },
              ],
            },
            "$amazon.price",
            null,
          ],
        },
        {
          $cond: [
            {
              $and: [
                { $eq: ["$flipkart.available", true] },
                { $gt: ["$flipkart.price", 0] },
              ],
            },
            "$flipkart.price",
            null,
          ],
        },
      ],
      as: "price",
      cond: { $ne: ["$$price", null] },
    },
  },
});
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      featured,
      deal,
      page = 1,
      limit = 12,
      sort = "newest",
    } = req.query;

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const itemsPerPage = Math.min(
      Math.max(parseInt(limit, 10) || 12, 1),
      100
    );

    const skip =
      (currentPage - 1) * itemsPerPage;

    const match = {
      status: "published",
    };

    if (category) {
      match.category = category;
    }

    if (brand) {
      match.brand = brand;
    }

    if (featured === "true") {
      match.featured = true;
    }

    if (deal === "true") {
      match.deal = true;
    }

    if (search) {
      match.$text = {
        $search: search,
      };
    }

    const pipeline = [
      {
        $match: match,
      },
      {
        $addFields: {
          bestPrice: getBestPriceExpression(),
        },
      },
    ];

    if (sort === "price-low") {
      pipeline.push({
        $sort: {
          bestPrice: 1,
          createdAt: -1,
        },
      });
    } else if (sort === "price-high") {
      pipeline.push({
        $sort: {
          bestPrice: -1,
          createdAt: -1,
        },
      });
    } else if (sort === "rating") {
      pipeline.push({
        $sort: {
          rating: -1,
          createdAt: -1,
        },
      });
    } else if (sort === "oldest") {
      pipeline.push({
        $sort: {
          createdAt: 1,
        },
      });
    } else {
      pipeline.push({
        $sort: {
          createdAt: -1,
        },
      });
    }

    pipeline.push({
      $facet: {
        products: [
          {
            $skip: skip,
          },
          {
            $limit: itemsPerPage,
          },
          {
            $project: {
              bestPrice: 0,
            },
          },
        ],
        total: [
          {
            $count: "count",
          },
        ],
      },
    });

    const [result] =
      await Product.aggregate(pipeline);

    const products = result?.products || [];

    const total =
      result?.total?.[0]?.count || 0;

    const totalPages = Math.ceil(
      total / itemsPerPage
    );

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
        total,
        totalPages,
        hasNextPage:
          currentPage < totalPages,
        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

/**
 * GET /api/products/:slug
 */
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

/**
 * POST /api/products
 *
 * Temporary public endpoint.
 *
 * IMPORTANT:
 * Before production, protect this route
 * with admin authentication.
 */
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Product slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

/**
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

/**
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

export {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};