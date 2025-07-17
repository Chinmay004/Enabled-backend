import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import {
  getAllProducts,
  getProductById,
  addProduct,
  getRelatedProducts
} from '../controllers/productController.js';

const router = express.Router();

const upload = multer({ storage }); // 🔁 Cloudinary-based multer

router.get('/', getAllProducts);
router.get('/related/items', getRelatedProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), addProduct);

export default router;
