import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Using String ID as per existing logic
    type: { type: String, required: true },
    location: { type: String, required: true },
    status: {
        type: String,
        enum: ['Online', 'Offline', 'Warning'],
        default: 'Offline'
    },
    value: { type: String },
    last_update: { type: Date, default: Date.now }
}, { _id: false });

export default mongoose.models.Sensor || mongoose.model('Sensor', SensorSchema);
