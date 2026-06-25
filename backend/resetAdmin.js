/**
 * NAVBODH ORGANICS — Reset / Create Admin User
 * =============================================
 * This script uses your actual User model so the pre-save
 * hook handles password hashing correctly (no double-hash).
 *
 * HOW TO RUN:
 *   1. Place this file in your backend/ folder (same level as server.js)
 *   2. Make sure your .env file is present with MONGODB_URI
 *   3. Run:  node resetAdmin.js
 *   4. DELETE this file after running!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User'); // uses your real model with pre-save hook

const ADMIN = {
  name:     'Admin',
  email:    'admin@navbodhorganic.com',
  password: 'Navbodh@2024',  // plain text — the model will hash it automatically
};

async function resetAdmin() {
  try {
    console.log('🔗  Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected!\n');

    const existing = await User.findOne({ email: ADMIN.email });

    if (existing) {
      // Update password and role — pre-save hook will hash the new password
      existing.password = ADMIN.password;
      existing.role     = 'admin';
      existing.name     = ADMIN.name;
      existing.markModified('password');
      await existing.save();
      console.log('✅  Admin password reset successfully!\n');
    } else {
      // Create brand new admin user
      await User.create({
        name:     ADMIN.name,
        email:    ADMIN.email,
        password: ADMIN.password,  // pre-save hook hashes this
        role:     'admin',
      });
      console.log('🎉  Admin user created!\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email    : ${ADMIN.email}`);
    console.log(`   Password : ${ADMIN.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐  Login at: https://www.navbodhorganic.com/admin/login');
    console.log('⚠️   DELETE this file now for security!\n');

  } catch (err) {
    console.error('❌  Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetAdmin();