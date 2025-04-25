import express from 'express';
import { getCart, updateCart, checkProductInCart ,checkYearlyLimitForProduct,getUserProductPurchaseCount} from '../controllers/cartController.js';
import verifyFirebaseToken from '../middleware/firebaseAuth.js';

const router = express.Router();

router.get('/',verifyFirebaseToken, getCart);
router.post('/',verifyFirebaseToken, updateCart);
router.post('/check', verifyFirebaseToken, checkProductInCart);
router.post('/check-yearly-limit', checkYearlyLimitForProduct);
router.post("/purchase-count", getUserProductPurchaseCount);


export default router;
// router.delete('/:userId', clearCart);
