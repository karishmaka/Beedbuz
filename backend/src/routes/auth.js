const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'User registered' });
});

router.post('/login', (req, res) => {
  res.json({ success: true, token: 'jwt_token' });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

module.exports = router;
