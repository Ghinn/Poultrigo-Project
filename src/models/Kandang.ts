import mongoose from 'mongoose';

const KandangSchema = new mongoose.Schema({
    name: { type: String, required: true },
    population: { type: Number, default: 0 },
    age: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Kandang || mongoose.model('Kandang', KandangSchema);
