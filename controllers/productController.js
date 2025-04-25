import Product from '../models/product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add product
export const addProduct = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : '';

    const newProduct = new Product({
      ...req.body,
      image: imageUrl, // ✅ Save Cloudinary URL
      price: parseFloat(req.body.price),
      countInStock: parseInt(req.body.countInStock),
    });
    // console.log("Body:", req.body);


    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// export const getRelatedProducts = async (req, res) => {
//   const { category, excludeId } = req.query;

//   try {
//     let related = [];

//     if (category) {
//       related = await Product.find({
//         category,
//         _id: { $ne: excludeId },
//       }).limit(10);
//     }

//     // If no category or related list is empty, fallback to next products
//     if (!category || related.length === 0) {
//       related = await Product.find({
//         _id: { $ne: excludeId },
//       })
//         .limit(10);
//     }
//     console.log(related);
//     res.json(related);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getRelatedProducts = async (req, res) => {
  const { excludeId } = req.query;

  try {
    const related = await Product.find({
      _id: { $ne: excludeId },
    }).limit(10);

    // console.log(related);
    res.json(related);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
