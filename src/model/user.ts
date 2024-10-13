import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'member' | 'admin';
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        trim: true,
        validate: {
            validator: (value: string) => {
                // Regex untuk validasi email
                const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/;
                return regex.test(value);
            },
            message: (props) => `${props.value} invalid email`,
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: {
            values: ['member', 'admin'],
            message: '{VALUE} is not a valid role, must be either member or admin'
        },
        default: 'member',
    },
}, { timestamps: true })

// Membuat model dari schema
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User