// Import types for Express request and response objects
import { Request, Response } from 'express';
// Import the database pool for running queries
import pool from '../db';

// Controller function to get bridge data based on query parameters
export const getBridges = async (req: Request, res: Response) => {
  // Destructure query parameters, setting default values for limit and offset
  const { 
    state_code, 
    structure_number, 
    record_type, 
    route_prefix, 
    limit = 10, 
    offset = 0 
  } = req.query;

  // Initialize the base SQL query
  let query = 'SELECT * FROM bridges WHERE 1=1';
  const values: any[] = []; // Array to store parameterized query values for security

  // Conditionally add filters to the query based on query parameters
  if (state_code) {
    query += ' AND state_code = $' + (values.length + 1);
    values.push(state_code);
  }
  if (structure_number) {
    query += ' AND structure_number ILIKE $' + (values.length + 1); // Case-insensitive match
    values.push(`%${structure_number}%`);
  }
  if (record_type) {
    query += ' AND record_type = $' + (values.length + 1);
    values.push(record_type);
  }
  if (route_prefix) {
    query += ' AND route_prefix = $' + (values.length + 1);
    values.push(route_prefix);
  }

  // Add pagination to the query, setting limit and offset values
  query += ' LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
  values.push(limit, offset);

  try {
    // Execute the query with the built SQL string and values array
    const result = await pool.query(query, values);
    // Send the query results as a JSON response
    res.json(result.rows);
  } catch (err) {
    // Log any errors and send a 500 status with an error message
    console.error('Error querying bridges:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};
