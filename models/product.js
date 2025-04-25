// models/Product.js

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  countInStock: { type: Number, default: null },
  yearlyLimitPerUser: { type: Number, default: 1 }, 
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
