// File: Server/src/routes/authRoutes.js (Final Version with Documentation)

const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in Firebase Authentication and stores user details in Firestore.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: "testuser@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password (min 6 characters).
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: "Test User"
 *     responses:
 *       '201':
 *         description: User registered successfully. Returns a Firebase ID token.
 *       '400':
 *         description: Bad request, e.g., email already in use.
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticates a user with their email and password and returns a Firebase ID token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: "testuser@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Login successful. Returns a Firebase ID token.
 *       '401':
 *         description: Unauthorized, invalid credentials.
 */
router.post('/login', loginUser);

module.exports = router;