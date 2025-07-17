import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";


const userSchema = new Schema<IUser>({
    // id: { type: String, required: [true, "ID is required"], unique: true },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        // match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v: string) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    name: { type: String, required: [true, "Name keno dao naI?"], trim: true, maxlength: 30, minlength: 3 },
    age: { type: Number, required: [true, "Age is required"] },
    password: { type: String, required: [true, "Password is required"], minlength: [6, "Password must be at least 6 characters long"] },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    versionKey: false
})


export const UserModel = model<IUser>('User', userSchema);