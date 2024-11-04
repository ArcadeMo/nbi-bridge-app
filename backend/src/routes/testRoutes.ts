// src/routes/testRoutes.ts
import express from 'express';
import pool from '../db';

const router = express.Router();

// Test endpoint to fetch data from the bridges table
router.get('/bridges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bridges LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying bridges:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Test endpoint to fetch data from the location_data table
router.get('/location-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM location_data LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying location data:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Test endpoint to fetch data from the structure_details table
router.get('/structure-details', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM structure_details LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying structure details:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Test endpoint to fetch data from the condition_ratings table
router.get('/condition-ratings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM condition_ratings LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying condition ratings:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Test endpoint to fetch data from the inspection_data table
router.get('/inspection-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inspection_data LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying inspection data:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

export default router;
