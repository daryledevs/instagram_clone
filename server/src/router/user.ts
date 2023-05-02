import express from "express";
import { findUser, getTotalFeed, getUserFeed, register, userData } from "../controller/user";
import checkTkn from "../middleware/checkTkn";
const router = express.Router();

router.use(checkTkn);
router.post("/register", register);
router.post("/feed", getUserFeed);
router.get("/", userData);
router.get("/search", findUser);
router.get("/feed/count", getTotalFeed);

export default router;
