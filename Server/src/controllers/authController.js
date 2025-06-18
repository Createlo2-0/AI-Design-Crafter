const { auth, db } = require("../config/firebase");
const UserModel = require("../models/userModel");
const axios = require("axios");

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

async function signup(req, res) {
  const { email, password } = req.body;
  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const user = new UserModel({
      id: userRecord.uid,
      email: userRecord.email,
      role: "user",
      avatarUrl: userRecord.photoURL || "",
      status: "active",
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    await db
      .collection("users")
      .doc(user.id)
      .set({ ...user });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    res.status(200).json({
      message: "Login successful",
      uid: response.data.localId,
      email: response.data.email,
      idToken: response.data.idToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });
  } catch (error) {
    const message =
      error.response && error.response.data && error.response.data.error
        ? error.response.data.error.message
        : error.message;
    res.status(401).json({ error: message });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const resetLink = await auth.generatePasswordResetLink(email);
    res.status(200).json({
      message: "Password reset link generated.",
      resetLink,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  signup,
  login,
  forgotPassword,
};
