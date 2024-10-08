import {Types} from "mongoose"
import {Request, Response, NextFunction} from "express"
import { Channel } from "../models/Channel"
import { User } from "../models/User"


export const createChannel = async (req: Request, res: Response, next: NextFunction) => { //TODO: Revisar codigo
    try {
        const { name, members } = req.body
        const userId = req.userId
        const admin = await User.findById(userId)

        if (!admin) {
            res.status(400).send("Admin user not found.")
            return 
        }

        const validMembers = await User.find({ _id: { $in: members } })
        
        if (validMembers.length !== members.length) {
            res.status(400).send("Some members are not valid users.")
            return 
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId
        })

        await newChannel.save()
        res.status(201).json({ channel: newChannel })
        return 
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return 
    }
}

export const getUserChannels = async (req: Request, res: Response, next: NextFunction) => { //TODO: Revisar codigo
    try {
        const userId = new Types.ObjectId(req.userId)
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 })
        res.status(201).json({ channels })
        return 
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return 
    }
}

export const getChannelMessages = async (req: Request, res: Response, next: NextFunction) => { //TODO: Revisar codigo
    try {
        const { channelId } = req.params
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "firstName lastName email _id image color"
            }
        })
        if (!channel) {
            res.status(404).send("Channel not found.")
            return 
        }
        res.status(201).json({ channel })
        return 
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
        return 
    }
}