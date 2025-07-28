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

    // Validate and parse price
    let price = req.body.price;
    console.log('Incoming price (addProduct):', price);
    if (price !== undefined) {
      if (isNaN(price) || price === '' || price === null) {
        return res.status(400).json({ message: 'Invalid price value' });
      }
      price = parseFloat(price);
    }

    // Validate and parse countInStock
    let countInStock = req.body.countInStock;
    if (countInStock !== undefined) {
      if (isNaN(countInStock) || countInStock === '' || countInStock === null) {
        return res.status(400).json({ message: 'Invalid countInStock value' });
      }
      countInStock = parseInt(countInStock);
    }

    const newProduct = new Product({
      ...req.body,
      image: imageUrl, // ✅ Save Cloudinary URL
      price,
      countInStock,
    });
    // console.log("Body:", req.body);

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body };

    // Handle image upload if present
    if (req.file) {
      updateFields.image = req.file.path;
    }

    // Validate and parse price
    if (updateFields.price !== undefined) {
      console.log('Incoming price (updateProduct):', updateFields.price);
      if (isNaN(updateFields.price) || updateFields.price === '' || updateFields.price === null) {
        return res.status(400).json({ message: 'Invalid price value' });
      }
      updateFields.price = parseFloat(updateFields.price);
    }
    // Validate and parse countInStock
    if (updateFields.countInStock !== undefined) {
      if (isNaN(updateFields.countInStock) || updateFields.countInStock === '' || updateFields.countInStock === null) {
        return res.status(400).json({ message: 'Invalid countInStock value' });
      }
      updateFields.countInStock = parseInt(updateFields.countInStock);
    }
    // Validate and parse yearlyLimitPerUser
    if (updateFields.yearlyLimitPerUser !== undefined) {
      if (isNaN(updateFields.yearlyLimitPerUser) || updateFields.yearlyLimitPerUser === '' || updateFields.yearlyLimitPerUser === null) {
        return res.status(400).json({ message: 'Invalid yearlyLimitPerUser value' });
      }
      updateFields.yearlyLimitPerUser = parseInt(updateFields.yearlyLimitPerUser);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
