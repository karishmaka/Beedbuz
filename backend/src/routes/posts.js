const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Post created' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id } });
});

router.post('/:id/like', (req, res) => {
  res.json({ success: true, message: 'Post liked' });
});

module.exports = router;
