import Order from '../models/Order.js';
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!userId || !address) {
      return res.status(400).json({ message: "User ID and address are required" });
    }

    const userCart = await Cart.findOne({ userId }).populate('items.productId');

if (!userCart || !userCart.items.length) {
  return res.status(400).json({ message: "Cart is empty" });
}

// Prepare order products
const products = userCart.items.map((item) => ({
  productId: item.productId._id,
  name: item.productId.name,
  priceAtPurchase: item.productId.price,
  image: item.productId.image,
  quantity: item.quantity,
}));

    const totalPrice = products.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    // Create order
    const newOrder = new Order({
      userId,
      products,
      totalPrice,
      address,
    });

    await newOrder.save();

    // Clear the cart
    await Cart.deleteMany({ userId });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log("backend ORders output:",orders);

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting the order" });
  }
};

