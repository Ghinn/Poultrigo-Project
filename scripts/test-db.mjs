import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Manually read .env since we are running standalone
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

console.log('Testing connection with:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Password Length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'poultrigo_db',
        });
        console.log('✅ Connection Successful!');

        // Check users table
        const [rows] = await connection.execute("SHOW TABLES LIKE 'users'");
        if (rows.length === 0) {
            console.error('❌ Table "users" does not exist!');
        } else {
            console.log('✅ Table "users" exists.');
            const [cols] = await connection.execute("DESCRIBE users");
            console.log('Columns:', cols.map(c => c.Field).join(', '));

            // List users
            const [users] = await connection.execute("SELECT id, name, email, role, password FROM users");
            console.log('\nExisting Users:');
            users.forEach(u => {
                console.log(`- ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, Password Hash: ${u.password ? u.password.substring(0, 10) + '...' : 'NULL'}`);
            });
        }

        await connection.end();
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('👉 Check your username and password.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('👉 Check if MySQL is running and the host/port are correct.');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('👉 Check if the database name is correct.');
        }
    }
}

testConnection();
