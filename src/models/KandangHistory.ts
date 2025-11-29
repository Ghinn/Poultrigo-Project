import mongoose from 'mongoose';

const KandangHistorySchema = new mongoose.Schema({
    kandang_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kandang', required: true },
    action: { type: String, required: true },
    population: { type: Number, required: true },
    age: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.KandangHistory || mongoose.model('KandangHistory', KandangHistorySchema);
