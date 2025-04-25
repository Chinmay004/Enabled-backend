// middleware/firebaseAuth.js
import admin from '../server.js';

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("AUth header:"+authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Includes firebase UID, email, etc.
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};

export default verifyFirebaseToken;



// import verifyFirebaseToken from '../middleware/firebaseAuth.js';

// router.post('/register', verifyFirebaseToken, registerUser);