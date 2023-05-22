import { InferSchemaType, Schema, model } from "mongoose";

const taskSchema = new Schema({
    userId: {type:Schema.Types.ObjectId, required: true},
    name: {type:String, required: true},
    isCompleted: {type: Boolean, default: false},
    isImportant: {type: Boolean, default: false},
}, {timestamps: true});

type Task = InferSchemaType<typeof taskSchema>;

export default model<Task>("Task", taskSchema);