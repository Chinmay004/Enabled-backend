import express from 'express';
import { getUserProfile, createOrUpdateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/:uid', getUserProfile);
router.post('/', createOrUpdateUser);

export default router;
