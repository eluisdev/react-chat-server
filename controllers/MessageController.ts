import { Request, Response } from "express"
import { Message } from "../models/Message"
import { v2 as cloudinary } from "cloudinary"

interface MulterRequest extends Request {
    file: any
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const userOne = req.userId
        const userTwo = req.body.id

        if (!userOne || !userTwo) {
            res.status(400).send("Both user ID's are required.")
            return
        }

        const messages = await Message.find({ //TODO: Revisar codigo
            $or: [
                { sender: userOne, recipient: userTwo },
                { sender: userTwo, recipient: userOne },
            ]
        }).sort({ timestamp: 1 })

        res.status(200).json({ messages })
        return
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return
    }
}

export const uploadFile = async (req: MulterRequest, res: Response) => {//TODO revisar codigo
    try {
        if (!req.file) {
            res.status(400).send("File is required")
            return
        }

        const fileUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" })
        const fileName = fileUpload.secure_url

        res.status(200).json({ filePath: fileName })
        return
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return
    }
}
