import { Request, Response } from 'express'
import pool from '../db'

// Controller function to get location data based on query parameters
export const getLocationData = async (req: Request, res: Response) => {
  // Destructure query parameters, setting default values for limit and offset
  const { county_code, place_code, highway_district, latitude, longitude, limit = 100, offset = 0 } = req.query

  // Initialize the base SQL query
  let query = 'SELECT * FROM location_data WHERE 1=1'
  const values: any[] = [] // Array to store parameterized query values for security

  // Conditionally add filters to the query based on each query parameter
  if (county_code) {
    query += ' AND county_code = $' + (values.length + 1)
    values.push(county_code)
  }
  if (place_code) {
    query += ' AND place_code = $' + (values.length + 1)
    values.push(place_code)
  }
  if (highway_district) {
    query += ' AND highway_district = $' + (values.length + 1)
    values.push(highway_district)
  }
  if (latitude) {
    query += ' AND latitude = $' + (values.length + 1)
    values.push(latitude)
  }
  if (longitude) {
    query += ' AND longitude = $' + (values.length + 1)
    values.push(longitude)
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
    console.error('Error querying location data:', err)
    res.status(500).json({ error: 'Database query failed' })
  }
}
