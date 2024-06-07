const express = require('express');
const GuinnessRecord = require('../models/default');
const router = express.Router();

router.get('/guinness', async (req, res) => {
  try {
    const records = await GuinnessRecord.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
