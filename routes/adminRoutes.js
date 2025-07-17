import express from 'express';
import admin from 'firebase-admin';
import User from '../models/User.js';

const router = express.Router();

router.get('/is-admin', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await User.findOne({ firebaseUID: decoded.uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ isAdmin: user.isAdmin || false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
