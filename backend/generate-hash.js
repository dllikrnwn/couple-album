-- Generate bcrypt hash for user password
-- Run this with: node generate-hash.js

import bcrypt from 'bcryptjs';

// IMPORTANT: Replace with actual password
const password = 'CHANGE_THIS_PASSWORD';
const username = 'Partner Name';
const email = 'partner@example.com';

const hash = await bcrypt.hash(password, 10);

console.log('='.repeat(60));
console.log('BCRYPT HASH GENERATOR');
console.log('='.repeat(60));
console.log('\nBcrypt hash:', hash);
console.log('\n📋 Copy this SQL and run in phpMyAdmin:\n');
console.log('USE couple_album;');
console.log(`INSERT INTO users (username, email, password_hash, role) VALUES ('${username}', '${email}', '${hash}', 'partner');`);
console.log('\n⚠️  IMPORTANT: Delete this file after use!');
console.log('='.repeat(60));
