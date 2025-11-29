import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    user_id: { type: String, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.CartItem || mongoose.model('CartItem', CartItemSchema);
