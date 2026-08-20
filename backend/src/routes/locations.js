const express = require('express');
const router = express.Router();

const TALUKAS = ['Ashti', 'Beed', 'Dharashiv', 'Gevrai', 'Hinjaval', 'Kaij', 'Latur', 'Majalgaon', 'Parli Vaijnath', 'Patoda', 'Wadi'];

router.get('/talukas', (req, res) => {
  res.json({ success: true, data: TALUKAS });
});

module.exports = router;
