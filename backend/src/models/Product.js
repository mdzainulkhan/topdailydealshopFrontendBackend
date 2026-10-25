import mongoose from "mongoose";

const storeOfferSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      min: 0,
    },

    originalPrice: {
      type: Number,
      min: 0,
    },

    affiliateUrl: {
      type: String,
      trim: true,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const specificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      required: false,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      required: false,
      default: "",
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    features: {
      type: [String],
      default: [],
    },

    specifications: {
      type: [specificationSchema],
      default: [],
    },

    pros: {
      type: [String],
      default: [],
    },

    cons: {
      type: [String],
      default: [],
    },

    amazon: {
      type: storeOfferSchema,
      default: undefined,
    },

    flipkart: {
      type: storeOfferSchema,
      default: undefined,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    deal: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: "text",
  brand: "text",
  description: "text",
});

productSchema.index({
  category: 1,
});

productSchema.index({
  status: 1,
});

productSchema.index({
  createdAt: -1,
});

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;