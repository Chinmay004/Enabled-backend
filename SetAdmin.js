import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.DATABASE_URL;

async function runMigration() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Set isAdmin: false where it's missing
    const res1 = await User.updateMany(
      { isAdmin: { $exists: false } },
      { $set: { isAdmin: false } }
    );
    console.log(`✅ Updated ${res1.modifiedCount} users to isAdmin:false`);

    // 2. Promote yourself
    const myEmail = "chinmaybadwaik9@gmail.com";
    const res2 = await User.updateOne(
      { email: myEmail },
      { $set: { isAdmin: true } }
    );

    if (res2.modifiedCount) {
      console.log(`✅ User ${myEmail} promoted to admin`);
    } else {
      console.log(`⚠️ No user found with email ${myEmail}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
