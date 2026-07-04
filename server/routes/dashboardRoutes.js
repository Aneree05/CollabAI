import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getClientDashboard,
  getFreelancerDashboard,
  getAdminDashboard,
} from "../controllers/dashboardController.js";


const router = express.Router();

router.get("/client", protect, getClientDashboard);
router.get("/freelancer", protect, getFreelancerDashboard);
router.get("/admin", protect, getAdminDashboard);


export default router;