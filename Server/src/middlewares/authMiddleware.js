// File: Server/src/middlewares/authMiddleware.js (Verified Version)

const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token is provided, send "Unauthorized"
    return res.status(401).json({ message: 'Unauthorized: No authentication token was provided.' });
  }

  // Extract the token from the "Bearer <token>" string
  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Use the Firebase Admin SDK to verify the token is valid
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // As per the task, attach the user's information to the request object.
    // The decodedToken contains uid, email, etc.
    req.user = decodedToken;
    
    // If verification is successful, pass control to the next function (the controller)
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    // If the token is invalid (expired, wrong format, etc.), send "Forbidden"
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
  }
};

module.exports = authMiddleware;