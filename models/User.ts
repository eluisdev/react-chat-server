import { genSalt, hash } from "bcrypt";
import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    email: String
    password: String
    firstName: String
    lastName: String
    image: String | null
    color: String
    profileSetup: Boolean
}

export const userSchema : Schema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    color: {
        type: Number,
        required: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    }
})

userSchema.pre("save", async function (next) {
    const salt = await genSalt()
    this.password = await hash(this.password as string, salt)
    next()
})

export const User = mongoose.model<IUser>("User", userSchema)