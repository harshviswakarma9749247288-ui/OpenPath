import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/openpath';

async function run() {
  console.log('Connecting to:', mongoUri);
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully!');

    const emailTarget = (process.argv[2] || '').trim();
    if (!emailTarget) {
      console.log('Usage: node scripts/delete_user.js <user-email>');
      const allUsers = await mongoose.connection.db.collection('users').find({}, { projection: { name: 1, email: 1, role: 1 } }).toArray();
      console.log(`Current users in DB (${allUsers.length}):`);
      allUsers.forEach((u) => console.log(`- ${u.email} (${u.role})`));
      await mongoose.disconnect();
      process.exit(0);
    }
    const emailRegex = new RegExp(`^${emailTarget}$`, 'i');

    const db = mongoose.connection.db;

    // Check users collection
    const user = await db.collection('users').findOne({ email: emailRegex });
    if (user) {
      console.log('Found user:', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });

      // Delete applications submitted by this user
      const appDeleteResult = await db.collection('applications').deleteMany({ student: user._id });
      console.log(`Deleted ${appDeleteResult.deletedCount} related applications.`);

      // Delete user
      const userDeleteResult = await db.collection('users').deleteOne({ _id: user._id });
      console.log(`Deleted user from 'users' collection: ${userDeleteResult.deletedCount}`);
    } else {
      console.log(`No user found with email ${emailTarget}`);
      // Also list all existing users so we know what is in the DB
      const allUsers = await db.collection('users').find({}, { projection: { name: 1, email: 1, role: 1 } }).toArray();
      console.log('Existing users in DB:');
      allUsers.forEach((u) => console.log(`- ${u.email} (${u.role}) [ID: ${u._id}]`));
    }

    // Delete any pending OTPs for this email
    const otpDeleteResult = await db.collection('otps').deleteMany({ email: emailRegex });
    console.log(`Deleted ${otpDeleteResult.deletedCount} OTP records.`);

  } catch (err) {
    console.error('Error during delete:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  }
}

run();
