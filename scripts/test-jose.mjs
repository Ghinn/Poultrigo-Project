import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode('dev-secret-key');

async function testJose() {
    try {
        console.log('Creating JWT...');
        const jwt = new SignJWT({ id: 1, name: 'Test' });
        console.log('JWT instance created:', jwt);

        jwt.setProtectedHeader({ alg: 'HS256' });
        console.log('Header set.');

        jwt.setExpirationTime('24h');
        console.log('Expiration set.');

        console.log('Signing...');
        const token = await jwt.sign(SECRET);
        console.log('✅ Token created:', token);
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

testJose();
