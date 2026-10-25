
import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});

connectDB().catch((error) => {
  console.error(
    "Backend is running, but database-dependent endpoints are unavailable:",
    error.message
  );
});
