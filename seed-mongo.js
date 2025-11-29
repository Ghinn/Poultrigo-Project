const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load from .env

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env');
    process.exit(1);
}

// --- Schemas ---

const UserSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    password: String,
    role: String,
    last_login: Date,
    created_at: { type: Date, default: Date.now }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
    image_url: String,
    description: String,
    status: { type: String, default: 'active' },
    created_at: { type: Date, default: Date.now }
});

const KandangSchema = new mongoose.Schema({
    name: String,
    population: Number,
    age: Number,
    created_at: { type: Date, default: Date.now }
});

const CartItemSchema = new mongoose.Schema({
    user_id: { type: String, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now }
});

const OrderItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    product_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    order_number: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User', required: true },
    status: { type: String, default: 'pending' },
    total_amount: { type: Number, required: true },
    buyer_name: { type: String, required: true },
    address: { type: String, required: true },
    whatsapp: { type: String, required: true },
    items: [OrderItemSchema],
    created_at: { type: Date, default: Date.now }
});

const KandangHistorySchema = new mongoose.Schema({
    kandang_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kandang', required: true },
    action: { type: String, required: true },
    population: { type: Number, required: true },
    age: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

const SensorSchema = new mongoose.Schema({
    _id: { type: String, required: true },
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

// --- Models ---

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Kandang = mongoose.model('Kandang', KandangSchema);
const CartItem = mongoose.model('CartItem', CartItemSchema);
const Order = mongoose.model('Order', OrderSchema);
const KandangHistory = mongoose.model('KandangHistory', KandangHistorySchema);
const Sensor = mongoose.model('Sensor', SensorSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});
        await Kandang.deleteMany({});
        await CartItem.deleteMany({});
        await Order.deleteMany({});
        await KandangHistory.deleteMany({});
        await Sensor.deleteMany({});
        console.log('Data cleared.');

        // Seed Users
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminId = `user_${Date.now()}`;
        const operatorId = `user_${Date.now() + 1}`;
        const guestId = `user_${Date.now() + 2}`;

        await User.create([
            {
                _id: adminId,
                name: 'Admin Developer',
                email: 'admin@poultrigo.com',
                password: hashedPassword,
                role: 'admin'
            },
            {
                _id: operatorId,
                name: 'Operator Kandang',
                email: 'operator@poultrigo.com',
                password: hashedPassword,
                role: 'operator'
            },
            {
                _id: guestId,
                name: 'Guest User',
                email: 'guest@poultrigo.com',
                password: hashedPassword,
                role: 'guest'
            }
        ]);
        console.log('Seeded users');

        // Seed Products
        await Product.create([
            {
                name: 'Pakan Ayam Starter',
                price: 450000,
                stock: 50,
                image_url: 'https://images.unsplash.com/photo-1627483297929-37f416fec7cd?auto=format&fit=crop&w=800&q=80',
                description: 'Pakan ayam khusus untuk usia 0-21 hari. Mengandung protein tinggi untuk pertumbuhan optimal.'
            },
            {
                name: 'Vitamin Ayam VitaChick',
                price: 15000,
                stock: 100,
                image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
                description: 'Vitamin untuk menjaga daya tahan tubuh ayam. Mencegah stress dan penyakit.'
            },
            {
                name: 'Tempat Minum Otomatis',
                price: 75000,
                stock: 30,
                image_url: 'https://images.unsplash.com/photo-1585837575652-2c90d59096e1?auto=format&fit=crop&w=800&q=80',
                description: 'Tempat minum otomatis yang mudah dibersihkan dan higienis.'
            }
        ]);
        console.log('Seeded products');

        // Seed Kandang
        const kandangA = await Kandang.create({ name: 'Kandang A1', population: 1000, age: 14 });
        const kandangB = await Kandang.create({ name: 'Kandang B1', population: 1200, age: 21 });
        console.log('Seeded kandang');

        // Seed Kandang History (Initial creation log)
        await KandangHistory.create([
            { kandang_id: kandangA._id, action: 'Created', population: 1000, age: 14 },
            { kandang_id: kandangB._id, action: 'Created', population: 1200, age: 21 }
        ]);
        console.log('Seeded kandang history');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seed();
