import { Request, Response } from 'express'
import pool from '../db'

// Controller function to get structure details based on query parameters
export const getStructureDetails = async (req: Request, res: Response) => {
  // Destructure query parameters, setting default values for limit and offset
  const {
    main_unit_spans,
    structure_length_mt,
    max_span_len_mt,
    roadway_width_mt,
    deck_width_mt,
    limit = 1000,
    offset = 0,
  } = req.query

  // Initialize the base SQL query
  let query = 'SELECT * FROM structure_details WHERE 1=1'
  const values: any[] = [] // Array to store parameterized query values for security

  // Conditionally add filters to the query based on each query parameter
  if (main_unit_spans) {
    query += ' AND main_unit_spans = $' + (values.length + 1)
    values.push(Number(main_unit_spans))
  }
  if (structure_length_mt) {
    query += ' AND structure_length_mt = $' + (values.length + 1)
    values.push(Number(structure_length_mt))
  }
  if (max_span_len_mt) {
    query += ' AND max_span_len_mt = $' + (values.length + 1)
    values.push(Number(max_span_len_mt))
  }
  if (roadway_width_mt) {
    query += ' AND roadway_width_mt = $' + (values.length + 1)
    values.push(Number(roadway_width_mt))
  }
  if (deck_width_mt) {
    query += ' AND deck_width_mt = $' + (values.length + 1)
    values.push(Number(deck_width_mt))
  }

  // Add pagination to the query with limit and offset values
  query += ' LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2)
  values.push(limit, offset)

  try {
    // Execute the query with the constructed SQL and values array
    const result = await pool.query(query, values)
    // Send the result rows as a JSON response
    res.json(result.rows)
  } catch (err) {
    // Log any errors and send a 500 status with an error message
    console.error('Error querying structure details:', err)
    res.status(500).json({ error: 'Database query failed' })
  }
}
