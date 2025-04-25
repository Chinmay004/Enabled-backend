// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   products: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//       quantity: { type: Number, required: true }
//     }
//   ],
//   totalPrice: { type: Number },
//   orderDate: { type: Date, default: Date.now },
//   status: { type: String, default: "Pending" }, // or "Delivered", "Rejected", etc.
// }, { timestamps: true });

// const Order = mongoose.model('Order', orderSchema);

// export default Order;


import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },

  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      priceAtPurchase: Number,
      image: String,
      quantity: { type: Number, required: true }
    }
  ],

  totalPrice: { type: Number, required: true },

  address: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Indonesia' }
  },

  orderDate: { type: Date, default: Date.now }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
