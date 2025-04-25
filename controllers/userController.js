import User from '../models/User.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register or update user
export const createOrUpdateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUID: req.body.firebaseUID },
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
