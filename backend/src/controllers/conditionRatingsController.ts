import { Request, Response } from 'express';
import pool from '../db';

// Controller function to get bridge condition ratings based on query parameters
export const getConditionRatings = async (req: Request, res: Response) => {
  // Destructure query parameters, setting default values for limit and offset
  const {
    deck_condition,
    superstructure_cond,
    substructure_cond,
    channel_cond,
    culvert_cond,
    limit = 1000,
    offset = 0,
  } = req.query;

  // Initialize the base SQL query
  let query = 'SELECT * FROM condition_ratings WHERE 1=1';
  const values: any[] = []; // Array to store parameterized query values for security

  // Conditionally add filters to the query based on each query parameter
  if (deck_condition) {
    query += ' AND deck_condition = $' + (values.length + 1);
    values.push(Number(deck_condition)); // Convert string input to number for query
  }
  if (superstructure_cond) {
    query += ' AND superstructure_cond = $' + (values.length + 1);
    values.push(Number(superstructure_cond));
  }
  if (substructure_cond) {
    query += ' AND substructure_cond = $' + (values.length + 1);
    values.push(Number(substructure_cond));
  }
  if (channel_cond) {
    query += ' AND channel_cond = $' + (values.length + 1);
    values.push(Number(channel_cond));
  }
  if (culvert_cond) {
    query += ' AND culvert_cond = $' + (values.length + 1);
    values.push(Number(culvert_cond));
  }

  // Add pagination to the query with limit and offset values
  query += ' LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
  values.push(limit, offset);

  try {
    // Execute the query with the constructed SQL and values array
    const result = await pool.query(query, values);
    // Send the result rows as a JSON response
    res.json(result.rows);
  } catch (err) {
    // Log any errors and send a 500 status with an error message
    console.error('Error querying condition ratings:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};
