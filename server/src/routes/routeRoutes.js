import express from "express";

import {
  findRoutes,
} from "../controllers/routeController.js";

const router = express.Router();

router.post("/", findRoutes);

export default router;