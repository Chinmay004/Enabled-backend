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
}, { timestamps: true });

export default mongoose.model('User', userSchema);
