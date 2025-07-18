import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true }, // Link to Firebase user
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  provider: { type: String }, 
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
