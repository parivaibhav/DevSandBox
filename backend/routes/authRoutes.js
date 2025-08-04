const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const { email, name, sub } = ticket.getPayload();
  let user = await User.findOne({ googleId: sub });
  if (!user) {
    user = await User.create({ email, name, googleId: sub });
  }

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ token: jwtToken });
});

module.exports = router;
