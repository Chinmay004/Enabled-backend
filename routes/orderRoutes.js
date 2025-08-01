import express from 'express';
import { placeOrder, getOrdersByUser,getUserOrders, deleteOrder,getAllOrders, } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', placeOrder);
router.get('/all', getAllOrders);
router.get('/:userId', getOrdersByUser);
router.get('/:userId', getUserOrders); // New route for fetching orders by user
router.delete("/:orderId", deleteOrder);


export default router;
