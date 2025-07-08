<<<<<<< HEAD
const { auth } = require("../config/firebase");
const logger = require("../utils/logger");
=======
// File: Server/src/middlewares/authMiddleware.js (Verified Version)
>>>>>>> 82aa9ff2abf2d2d2507077938a1b0bbec462b95c

const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
<<<<<<< HEAD
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("[verifyFirebaseToken] No token provided");
    return res.status(401).json({ error: "No token provided" });
=======

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token is provided, send "Unauthorized"
    return res.status(401).json({ message: 'Unauthorized: No authentication token was provided.' });
>>>>>>> 82aa9ff2abf2d2d2507077938a1b0bbec462b95c
  }

  // Extract the token from the "Bearer <token>" string
  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Use the Firebase Admin SDK to verify the token is valid
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // As per the task, attach the user's information to the request object.
    // The decodedToken contains uid, email, etc.
    req.user = decodedToken;
<<<<<<< HEAD
    logger.info("[verifyFirebaseToken] Token verified for user:", decodedToken.uid);
    next();
  } catch (error) {
    logger.error("[verifyFirebaseToken] Invalid or expired token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
=======
    
    // If verification is successful, pass control to the next function (the controller)
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    // If the token is invalid (expired, wrong format, etc.), send "Forbidden"
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
>>>>>>> 82aa9ff2abf2d2d2507077938a1b0bbec462b95c
  }
};

<<<<<<< HEAD
module.exports = { verifyFirebaseToken };
=======
module.exports = authMiddleware;
>>>>>>> 82aa9ff2abf2d2d2507077938a1b0bbec462b95c
