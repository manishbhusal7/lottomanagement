const express = require('express');
const router = express.Router();
const pool = require('../db/connect');
const authenticate = require('../middleware/auth');

// Create Lottery
router.post('/', authenticate, async (req, res) => {
  const { name, max_participants, draw_time } = req.body;
  
  try {
    const [result] = await pool.query(
      `INSERT INTO lotteries 
       (name, max_participants, draw_time, created_by, participants)
       VALUES (?, ?, ?, ?, ?)`,
      [name, max_participants, new Date(draw_time), req.auth.userId, JSON.stringify([])]
    );
    
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get All Lotteries
router.get('/', async (req, res) => {
  try {
    const [lotteries] = await pool.query(`
      SELECT l.*, u.full_name as creator_name 
      FROM lotteries l
      JOIN users u ON l.created_by = u.id
    `);
    res.json(lotteries);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;