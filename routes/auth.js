import express from 'express';
import verifyFirebaseToken from '../middleware/firebaseAuth.js';

const router = express.Router();

router.post('/login', verifyFirebaseToken, (req, res) => {
  // Now you can safely access req.user
  const user = req.user;
  console.log('Logged in user:', user);

  // You can now check if user exists in DB, create user, return data, etc.
  res.status(200).json({ message: 'Login successful', user });
});

router.post("/signup", async (req, res) => {
  const { uid, email, name, provider } = req.body;
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) return res.status(401).json({ message: "No token provided" });

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.email_verified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    // Upsert user in DB
    const user = await User.findOneAndUpdate(
      { uid },
      { email, name, provider },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "User signed up successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup" });
  }
});


export default router;
