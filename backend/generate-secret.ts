// Create a file called generate-secret.js
import { randomBytes } from 'crypto';

// Generate a 64-character hex string (32 bytes)
const secret = randomBytes(32).toString('hex');
console.log('JWT_SECRET=' + secret);