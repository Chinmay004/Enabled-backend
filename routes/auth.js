
import express from 'express';
import admin from 'firebase-admin';
import User from '../models/User.js';

const router = express.Router();

// router.post('/sync', async (req, res) => {
//   const idToken = req.headers.authorization?.split('Bearer ')[1];

//   if (!idToken) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     console.log("Decoded Token:", decodedToken);


//     const firebaseUID = decodedToken.uid;
//     const { email, name, provider } = req.body;
//     console.log("Body:", req.body);


// const provider_id = decodedToken.firebase?.sign_in_provider || provider || 'unknown';

//     // if (provider_id === 'password' && !decodedToken.email_verified) {
//     //   return res.status(403).json({ message: 'Email not verified' });
//     // }

//     const finalName = name?.trim() || (email ? email.split('@')[0] : 'New User');


//     const user = await User.findOneAndUpdate(
//   { firebaseUID },
//   {
//     firebaseUID,
//     email,
//     name: finalName,
//     // provider: provider || 'unknown',
//     provider: provider_id

//   },
//   { upsert: true, new: true }
// );


//     res.status(200).json({ message: 'User synced with DB', user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error during sync' });
//   }
// });
router.post('/sync', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUID = decodedToken.uid;
    const email = decodedToken.email;
    const provider_id = decodedToken.firebase?.sign_in_provider || 'unknown';

    const finalName = req.body.name?.trim() || (email ? email.split('@')[0] : 'New User');

    const user = await User.findOneAndUpdate(
      { firebaseUID },
      {
        firebaseUID,
        email,
        name: finalName,
        provider: provider_id,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'User synced with DB', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during sync' });
  }
});


// router.post('/sync', async (req, res) => {
//   const idToken = req.headers.authorization?.split('Bearer ')[1];
//   if (!idToken) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);

//     const firebaseUID = decodedToken.uid;
//     const email = decodedToken.email;
//     const emailVerified = decodedToken.email_verified;
//     const name = decodedToken.name || req.body.name || 'New User';
//     const provider_id = decodedToken.firebase?.sign_in_provider || 'unknown';

//     if (provider_id === 'password' && !emailVerified) {
//       return res.status(403).json({ message: 'Email not verified' });
//     }

//     const user = await User.findOneAndUpdate(
//       { firebaseUID },
//       {
//         firebaseUID,
//         email,
//         name,
//         provider: provider_id,
//       },
//       { upsert: true, new: true }
//     );

//     res.status(200).json({ message: 'User synced with DB', user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error during sync' });
//   }
// });


export default router;
