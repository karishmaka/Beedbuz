const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id, username: 'beedbuzz_user' } });
});

router.put('/:id', (req, res) => {
  res.json({ success: true, message: 'User updated' });
});

router.post('/:id/follow', (req, res) => {
  res.json({ success: true, message: 'User followed' });
});

module.exports = router;
