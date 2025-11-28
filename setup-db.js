const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setup() {
    console.log('Starting database setup...');

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'poultrigo_db',
            multipleStatements: true
        });

        console.log('Connected to database.');

        // Drop tables (Order matters due to Foreign Keys)
        console.log('Dropping existing tables...');
        await connection.query('DROP TABLE IF EXISTS order_items');
        await connection.query('DROP TABLE IF EXISTS orders');
        await connection.query('DROP TABLE IF EXISTS cart_items');
        await connection.query('DROP TABLE IF EXISTS kandang_history');
        await connection.query('DROP TABLE IF EXISTS kandang');
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query('DROP TABLE IF EXISTS products');
        await connection.query('DROP TABLE IF EXISTS sensors');

        // Create users table
        console.log('Creating users table...');
        await connection.query(`
      CREATE TABLE users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('guest', 'operator', 'admin') DEFAULT 'guest',
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create products table
        console.log('Creating products table...');
        await connection.query(`
      CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT DEFAULT 0,
        image_url VARCHAR(255),
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create kandang table
        console.log('Creating kandang table...');
        await connection.query(`
      CREATE TABLE kandang (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        population INT DEFAULT 0,
        age INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create kandang_history table
        console.log('Creating kandang_history table...');
        await connection.query(`
      CREATE TABLE kandang_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kandang_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        population INT NOT NULL,
        age INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandang_id) REFERENCES kandang(id) ON DELETE CASCADE
      )
    `);

        // Create orders table
        console.log('Creating orders table...');
        await connection.query(`
      CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL,
        buyer_name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        whatsapp VARCHAR(20) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

        // Create order_items table
        console.log('Creating order_items table...');
        await connection.query(`
      CREATE TABLE order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

        // Create cart_items table
        console.log('Creating cart_items table...');
        await connection.query(`
      CREATE TABLE cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id INT NOT NULL,
        quantity INT DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

        // Create sensors table
        console.log('Creating sensors table...');
        await connection.query(`
      CREATE TABLE sensors (
        id VARCHAR(50) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        location VARCHAR(100) NOT NULL,
        status ENUM('Online', 'Offline', 'Warning') DEFAULT 'Offline',
        value VARCHAR(50),
        last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        // Seed Admin User
        console.log('Seeding admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminId = `user_${Date.now()}`;
        await connection.query(
            'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [adminId, 'Admin Developer', 'admin@poultrigo.com', hashedPassword, 'admin']
        );

        // Seed Operator User
        console.log('Seeding operator user...');
        const operatorId = `user_${Date.now() + 1}`;
        await connection.query(
            'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [operatorId, 'Operator Kandang', 'operator@poultrigo.com', hashedPassword, 'operator']
        );

        // Seed Guest User
        console.log('Seeding guest user...');
        const guestId = `user_${Date.now() + 2}`;
        await connection.query(
            'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [guestId, 'Guest User', 'guest@poultrigo.com', hashedPassword, 'guest']
        );

        // Seed Kandang
        console.log('Seeding kandang...');
        await connection.query("INSERT INTO kandang (name, population, age) VALUES ('Kandang A1', 1000, 14)");
        await connection.query("INSERT INTO kandang (name, population, age) VALUES ('Kandang B1', 1200, 21)");

        // Seed Products
        console.log('Seeding products...');
        await connection.query(`
      INSERT INTO products (name, price, stock, image_url, description) VALUES 
      ('Pakan Ayam Starter', 450000, 50, 'https://images.unsplash.com/photo-1627483297929-37f416fec7cd?auto=format&fit=crop&w=800&q=80', 'Pakan ayam khusus untuk usia 0-21 hari. Mengandung protein tinggi untuk pertumbuhan optimal.'),
      ('Vitamin Ayam VitaChick', 15000, 100, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 'Vitamin untuk menjaga daya tahan tubuh ayam. Mencegah stress dan penyakit.'),
      ('Tempat Minum Otomatis', 75000, 30, 'https://images.unsplash.com/photo-1585837575652-2c90d59096e1?auto=format&fit=crop&w=800&q=80', 'Tempat minum otomatis yang mudah dibersihkan dan higienis.')
    `);

        console.log('Database setup completed successfully!');
        console.log('Default Accounts:');
        console.log('Admin: admin@poultrigo.com / admin123');
        console.log('Operator: operator@poultrigo.com / admin123');
        console.log('Guest: guest@poultrigo.com / admin123');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        if (connection) await connection.end();
    }
}

setup();
