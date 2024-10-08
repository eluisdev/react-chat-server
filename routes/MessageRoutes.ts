import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware";
import { getMessages, uploadFile } from "../controllers/MessageController";
import upload from "../middlewares/multer";

export const messageRoutes = Router()

messageRoutes.post("/get-messages",  verifyToken, getMessages)
messageRoutes.post("/upload-file",  verifyToken, upload.single("file"), uploadFile)

