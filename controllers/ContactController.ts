import {Types} from "mongoose"
import {Request, Response} from "express"
import { User } from "../models/User"
import { Message } from "../models/Message"

export const searchContacts = async (req: Request, res: Response) => { //TODO: Revisar codigo con CHATGPT
    try {
        const { searchTerm } = req.body
        if (searchTerm === undefined || searchTerm === null) {
            res.status(400).send("Searchterm is required.")
            return 
        }
        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )
        const regex = new RegExp(sanitizedSearchTerm, "i")
        const contacts = await User.find({
            $and: [{ _id: { $ne: req.userId } }],
            $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
        })

        res.status(200).json({ contacts })
        return 
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return 
    }
}

export const getContactsForDMList = async (req: Request, res: Response) => { //TODO: Revisar codigo con CHATGPT
    try {
        let { userId } = req
        userId = new Types.ObjectId(userId)
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                },
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                },
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ])

        res.status(200).json({ contacts })
        return 
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return 
    }
}

export const getAllContacts = async (req: Request, res: Response) => { //TODO: Revisar codigo con CHATGPT
    try {
        const users = await User.find(
            {_id: {$ne: req.userId}},
            "firstName lastName _id email"
        )
        const contacts = users.map(user => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id
        }))
        res.status(200).json({ contacts })
        return 
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return 
    }
}