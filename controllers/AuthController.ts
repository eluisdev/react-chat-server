import type { NextFunction, Request, Response } from "express"
import { v2 as cloudinary } from "cloudinary"
import { compare } from "bcrypt"
import { IUser, User } from "../models/User"
import jwt from "jsonwebtoken"
import { renameSync, unlinkSync } from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (email: String, userId: IUser['id']) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).send("Email and password is required.")
            return
        }
        const user = await User.create({ email, password })

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "none"
        })

        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        })
        return
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).send("Email and password is required.")
            return
        }
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).send("User with the given email not found.")
            return
        }
        const auth = await compare(password, user.password as string)
        if (!auth) {
            res.status(400).send("Password is incorrect,")
            return
        }
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "none"
        })
        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
        })
        return
    } catch (error) {
        console.log(error, "Error de express")
        res.status(500).send("Internal server error")
        return
    }
}

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const userData = await User.findById(req.userId)
        if (!userData) {
            res.status(404).send("User with the given email not found.")
        }
        res.status(200).json({
            user: {
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
            }
        })
        return
    } catch (error) {
        console.log(error, "Error de express")
        res.status(500).send("Internal server error")
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req
        const { firstName, lastName, color } = req.body

        if (!firstName || !lastName) {
            res
                .status(400)
                .send("Firstname, lastname and color is required.")
            return
        }

        const userData = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            color,
            profileSetup: true
        }
            , { new: true, runValidators: true })

        if (!userData) {
            res
                .status(400)
                .send("User not found.")
            return
        }

        res.status(200).json({
            user: {
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
            }
        })
        return
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return
    }
}

export const addProfileImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).send("File is required.")
            return
        }

        const imageUpload = await cloudinary.uploader.upload(req.file.path, {resource_type : "image"})
        const fileName = imageUpload.secure_url

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {image: fileName}, 
            {new:true, runValidators: true}
        )

        if (!updatedUser) {
            res
                .status(400)
                .send("User not found.")
            return
        }

        res.status(200).json({
            image: updatedUser.image
        })
        return
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return
    }
}

export const removeProfileImage = async (req: Request, res: Response) => {
    try {
        const { userId } = req
        const user = await User.findById(userId)

        if (!user) {
            res.status(404).send("User not found.")
            return
        }
        const publidId = user.image.split('/').pop().split('.')[0]

        await cloudinary.uploader.destroy(publidId)
    
        user.image = null
        await user.save()

        res.status(200).send("Profile image removed successfully.")
        return
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "none" })
        res.status(200).send("Logout successfull.")
        return
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return
    }
}