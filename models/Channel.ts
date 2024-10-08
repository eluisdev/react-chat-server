import mongoose, {Schema, Document, Types, PopulatedDoc} from "mongoose";
import { IUser } from "./User.js";
import { IMessage } from "./Message.js";

export interface IChannel extends Document {
    name: String
    members: PopulatedDoc<IUser & Document>[]
    admin: PopulatedDoc<IUser & Document>[]
    messages: PopulatedDoc<IMessage & Document>[]
    createdAt: Date
    updatedAt: Date 
}

export const channelSchema : Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [{type: Types.ObjectId, ref: "User", required: true}],
    admin: [{type: Types.ObjectId, ref: "User", required: true}],
    messages: [{type:Types.ObjectId, ref: "Message", required: false}],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
}) 

channelSchema.pre("save", function (next) {
    this.updatedAt = Date.now()
    next()
})

channelSchema.pre("findOneAndUpdate", function (next) { //TODO: Revisar codigo.
    this.set({updatedAt : Date.now()})
    next()
})

export const Channel = mongoose.model<IChannel>("Channel", channelSchema)