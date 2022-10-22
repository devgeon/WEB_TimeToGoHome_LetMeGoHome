import express from "express";
const router = express.Router();
import auth from "./auth/auth.js";
import user from "./user/user.js";
import share from "./share/share.js";

router.use("/auth", auth);

router.use("/user", user);

router.use("/share", share);

export default router;
