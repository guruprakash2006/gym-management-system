import express from "express";

import {
  createMember,
  getMembers,
  updateMember,
  deleteMember,
} from "../controllers/member.controller";

const router = express.Router();

router.post(
  "/",
  createMember
);

router.get(
  "/",
  getMembers
);

router.put(
  "/:id",
  updateMember
);

router.delete(
  "/:id",
  deleteMember
);

export default router;