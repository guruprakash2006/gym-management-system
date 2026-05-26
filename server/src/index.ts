import express from "express";
import cors from "cors";

import { pool } from "./config/db";

import memberRoutes from "./routes/member.routes";
import planRoutes from "./routes/plan.routes";
import subscriptionRoutes from "./routes/subscription.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});

// Health route
app.get("/health", (_req, res) => {
  res.json({
    status: "OK",
  });
});

// API routes
app.use("/api/members", memberRoutes);

app.use("/api/plans", planRoutes);

app.use(
  "/api/subscriptions",
  subscriptionRoutes
);

// PostgreSQL connection test
pool
  .connect()
  .then(() => {
    console.log(
      "PostgreSQL connected ✅"
    );
  })
  .catch((err) => {
    console.error(
      "DB connection error ❌",
      err
    );
  });

// Server start
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});