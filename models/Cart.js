import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // Firebase UID
    required: true,
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // ✅ Enables populate
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
