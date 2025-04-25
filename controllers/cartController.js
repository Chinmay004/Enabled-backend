import Cart from '../models/Cart.js';
import Order from "../models/order.js";
import Product from "../models/product.js";




export const getCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items must be a non-empty array" });
    }

    const { productId, quantity = 1 } = items[0];

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If removing but cart doesn't exist, just return empty
      if (quantity <= 0) return res.status(200).json({ items: [] });

      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex !== -1) {
        if (quantity <= 0) {
          cart.items.splice(existingItemIndex, 1); // Remove item
        } else {
          cart.items[existingItemIndex].quantity = quantity; // Update quantity
        }
      } else if (quantity > 0) {
        cart.items.push({ productId, quantity }); // Add new item
      }
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(400).json({ message: err.message });
  }
};



// Clear cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkProductInCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(200).json({ exists: false });
    }

    const exists = cart.items.some(item => item.productId.toString() === productId);
    // console.log("cart Controller check product in cart output:", exists);

    return res.status(200).json({ exists });
  } catch (err) {
    console.error("Error checking product in cart:", err);
    res.status(500).json({ message: err.message });
  }
};

export const checkYearlyLimitForProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const currentYear = new Date().getFullYear();

    // Find all orders for this user in the current year
    const orders = await Order.find({
      userId,
      orderDate: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`)
      },
      "products.productId": productId
    });
  



    // Count how many times the product has been purchased
    let totalQty = 0;
    orders.forEach(order => {
      const item = order.products.find(p => p.productId.toString() === productId);
      if (item) totalQty += item.quantity;
    });

    // Get product limit
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (totalQty >= product.yearlyLimitPerUser) {
      return res.status(403).json({
        message: `You've reached your yearly limit for this product (${product.yearlyLimitPerUser}).`
      });
    }

    return res.status(200).json({ allowed: true });

  } catch (err) {
    console.error("Error checking yearly limit:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// export const getUserProductPurchaseCount = async (req, res) => {
//   try {
//     const { userId, productId } = req.body;
//     const productIdStr = productId.toString();
//     const currentYear = new Date().getFullYear();

//     const orders = await Order.find({
//       userId,
//       orderDate: {
//         $gte: new Date(`${currentYear}-01-01`),
//         $lte: new Date(`${currentYear}-12-31`)
//       },
//       "products.productId": productId // match inside products array
//     });

//     let totalQty = 0;
//     orders.forEach(order => {
//       const product = order.products.find(p => p.productId.toString() === productIdStr);
//       if (product) totalQty += product.quantity;
//     });

//     res.status(200).json({ totalQty });
//   } catch (error) {
//     console.error("Error fetching user purchase count:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// // };





export const getUserProductPurchaseCount = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const productIdStr = productId.toString();
    const currentYear = new Date().getFullYear();

    // Fetch product to get the limit
    const product = await Product.findById(productIdStr);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const limit = product.yearlyLimitPerUser || 1;

    // Find all orders with this product
    const orders = await Order.find({
      userId,
      orderDate: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`)
      },
      "products.productId": productId
    });
    // console.log("Orders found:", orders.length);
    // console.log("Each order:", orders);

    // Calculate total quantity
    let totalQty = 0;
    orders.forEach(order => {
      const productInOrder = order.products.find(p => p.productId.toString() === productIdStr);
      if (productInOrder) totalQty += productInOrder.quantity;
    });

    res.status(200).json({ totalPurchased: totalQty, limit });
  } catch (error) {
    console.error("Error fetching user purchase count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// export const updateCart = async (req, res) => {
//   try {
//     const userId = req.user.uid; // Comes from Firebase middleware
//     const { items } = req.body;

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Items must be a non-empty array" });
//     }

//     const { productId, quantity = 1 } = items[0]; // Only taking the first item as per your frontend

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       // No cart exists, create one
//       cart = new Cart({
//         userId,
//         items: [{ productId, quantity }],
//       });
//     } else {
//       const existingItem = cart.items.find(
//         (item) => item.productId.toString() === productId
//       );

//       if (existingItem) {
//         existingItem.quantity += quantity; // Increment quantity
//       } else {
//         cart.items.push({ productId, quantity }); // Add new product
//       }
//     }

//     await cart.save();
//     return res.status(200).json(cart);
//   } catch (err) {
//     console.error("Error updating cart:", err);
//     res.status(400).json({ message: err.message });
//   }
// };