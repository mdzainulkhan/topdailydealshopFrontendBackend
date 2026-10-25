
import "dotenv/config";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

async function createAdmin() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } =
    process.env;

  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be configured"
    );
  }

  if (ADMIN_PASSWORD.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD must contain at least 12 characters"
    );
  }

  await mongoose.connect(MONGODB_URI);

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await Admin.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "Administrator",
        passwordHash,
        role: "admin",
      },
      $setOnInsert: { email },
    },
    {
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(`Admin account ready: ${email}`);
}

createAdmin()
  .catch((error) => {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
