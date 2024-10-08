import express, {NextFunction, Request, Response} from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import { authRoutes } from "./routes/AuthRoutes"
import { contactsRoutes } from "./routes/ContactRoutes"
import setupSocket from "./socket"
import { messageRoutes } from "./routes/MessageRoutes"
import { channelRoutes } from "./routes/ChannelRoutes"
import connectCloudinary from "./config/cloudinary"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const databaseURL = process.env.DATABASE_URL

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

// app.use("/uploads/profiles", express.static("/uploads/profiles"))
// app.use("/uploads/files", express.static("/uploads/files"))

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/contacts", contactsRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/channel", channelRoutes)

app.use ("/prueba", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json("Funciona el servidor")
})

const server = app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
})

setupSocket(server)

const connectDB = async () => {
    await mongoose.connect(databaseURL!)
    .then(() => console.log('DB Connection Successfull'))
    .catch(err => console.log(err.message))
}

connectDB()
connectCloudinary()

export default app

