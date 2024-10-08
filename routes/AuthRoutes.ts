import { Router } from "express";
import { addProfileImage, getUserInfo, login, signup, updateProfile, removeProfileImage, logout } from "../controllers/AuthController";
import { verifyToken } from "../middlewares/AuthMiddleware";
import multer from "multer";
import upload from "../middlewares/multer";

export const authRoutes = Router()

authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.get("/user-info", verifyToken, getUserInfo)
authRoutes.post("/update-profile", verifyToken, updateProfile)
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"),addProfileImage)
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage)
authRoutes.post("/logout", logout)