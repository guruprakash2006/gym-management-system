import express from "express";

import {
  createSubscription,
  getSubscriptions,
} from "../controllers/subscription.controller";

const router = express.Router();

router.post(
  "/",
  createSubscription
);

router.get(
  "/",
  getSubscriptions
);

export default router;