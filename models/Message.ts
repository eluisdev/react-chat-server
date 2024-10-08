import mongoose, {Schema, Document, Types} from "mongoose"

export interface IMessage extends Document {
    sender: Types.ObjectId
    recipient: Types.ObjectId
    messageType: String
    context: String
    fileUrl: String
    timestamp: Date
}

export const messageSchema : Schema = new Schema({ //TODO: Averiguar como editar una coleccion ya hecha
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: Types.ObjectId,
        ref: "User",
        required: false
    },
    messageType: {
        type: String,
        enum:["text","file"],
        required: true
    },
    content: {
        type: String,
        required: function () : boolean {
            return this.messageType === "text"
        }
    },
    fileUrl: {
        type: String,
        required: function () : boolean {
            return this.messageType === "file"
        }
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

export const Message = mongoose.model<IMessage>("Message", messageSchema)