import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    product_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    order_number: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User', required: true }, // User ID is String in our User model
    status: { type: String, default: 'pending' },
    total_amount: { type: Number, required: true },
    buyer_name: { type: String, required: true },
    address: { type: String, required: true },
    whatsapp: { type: String, required: true },
    items: [OrderItemSchema],
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
