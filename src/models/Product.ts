import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    // Mongoose adds _id by default (ObjectId), but we can use a counter or just let it be ObjectId.
    // Existing logic uses INT AUTO_INCREMENT. 
    // For simplicity in migration, we can let Mongo use ObjectId, but we might need to adjust frontend if it expects numbers.
    // However, looking at setup-db.js, products have INT id.
    // Let's use a counter or just switch to ObjectId and update frontend/backend to handle string IDs.
    // Switching to ObjectId is better for Mongo.
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image_url: { type: String },
    description: { type: String },
    status: { type: String, default: 'active' },
    created_at: { type: Date, default: Date.now }
});

// To maintain compatibility with existing number IDs, we could use a plugin, 
// but for this migration, I will switch to using the default ObjectId 
// and ensure the application handles it (usually just .toString()).
// If the app relies heavily on numeric IDs, this might be a breaking change for URLs like /products/1.
// I will assume string IDs are acceptable or I will fix the routing.

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
