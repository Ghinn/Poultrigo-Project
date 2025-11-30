import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
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

async function updatePasswords() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'poultrigo_db',
        });
        console.log('✅ Connected to database.');

        const newPassword = '12345678';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log(`Updating all users passwords to '${newPassword}'...`);

        const [result] = await connection.execute('UPDATE users SET password = ?', [hashedPassword]);

        console.log(`✅ Updated ${result.changedRows} users.`);

        await connection.end();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

updatePasswords();
