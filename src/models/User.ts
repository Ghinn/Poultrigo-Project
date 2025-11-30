import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Using String ID to match existing logic (user_timestamp)
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['guest', 'operator', 'admin'],
        default: 'guest'
    },
    last_login: { type: Date },
    created_at: { type: Date, default: Date.now }
}, { _id: false }); // We manually set _id

export default mongoose.models.User || mongoose.model('User', UserSchema);
