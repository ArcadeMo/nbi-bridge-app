import { Request, Response } from 'express'
import pool from '../db'

// Controller function to get inspection data based on query parameters
export const getInspectionData = async (req: Request, res: Response) => {
  // Destructure query parameters, setting default values for limit and offset
  const {
    date_of_inspect,
    inspect_freq_months,
    fracture_critical,
    underwater_inspect,
    special_inspect,
    limit = 1000,
    offset = 0,
  } = req.query

  // Initialize the base SQL query
  let query = 'SELECT * FROM inspection_data WHERE 1=1'
  const values: any[] = [] // Array to store parameterized query values for security

  // Conditionally add filters to the query based on each query parameter
  if (date_of_inspect) {
    query += ' AND date_of_inspect = $' + (values.length + 1)
    values.push(date_of_inspect)
  }
  if (inspect_freq_months) {
    query += ' AND inspect_freq_months = $' + (values.length + 1)
    values.push(Number(inspect_freq_months)) // Convert to number for query
  }
  if (fracture_critical !== undefined) {
    query += ' AND fracture_critical = $' + (values.length + 1)
    values.push(fracture_critical === 'true') // Convert to boolean for query
  }
  if (underwater_inspect !== undefined) {
    query += ' AND underwater_inspect = $' + (values.length + 1)
    values.push(underwater_inspect === 'true') // Convert to boolean for query
  }
  if (special_inspect !== undefined) {
    query += ' AND special_inspect = $' + (values.length + 1)
    values.push(special_inspect === 'true') // Convert to boolean for query
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
    console.error('Error querying inspection data:', err)
    res.status(500).json({ error: 'Database query failed' })
  }
}
