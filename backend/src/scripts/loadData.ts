import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import pool from '../db'

// Helper functions to validate and parse values

// Parse a string to an integer, returning null if parsing fails
function parseInteger(value: string): number | null {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? null : parsed
}

// Parse a string to a decimal, returning null if parsing fails
function parseDecimal(value: string): number | null {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? null : parsed
}

// Function to load data from a CSV file and insert it into the database
async function loadCSVData() {
  const csvFilePath = path.join(__dirname, '../../data/bridges.csv') // Path to the CSV file

  // Read the CSV file, parse each row, and insert data into tables
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      try {
        // Insert data into the bridges table
        const bridgeResult = await pool.query(
          `INSERT INTO bridges (state_code, structure_number, record_type, route_prefix, route_number)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [
            row.STATE_CODE_001,
            row.STRUCTURE_NUMBER_008,
            row.RECORD_TYPE_005A,
            row.ROUTE_PREFIX_005B,
            row.ROUTE_NUMBER_005D,
          ]
        )

        const bridgeId = bridgeResult.rows[0].id // Get the generated bridge ID

        // Insert data into the location_data table
        await pool.query(
          `INSERT INTO location_data (bridge_id, latitude, longitude, county_code, place_code, highway_district)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            bridgeId,
            parseDecimal(row.LAT_016),
            parseDecimal(row.LONG_017),
            row.COUNTY_CODE_003,
            row.PLACE_CODE_004,
            row.HIGHWAY_DISTRICT_002,
          ]
        )

        // Insert data into the structure_details table
        await pool.query(
          `INSERT INTO structure_details (bridge_id, main_unit_spans, structure_length_mt, max_span_len_mt, roadway_width_mt, deck_width_mt)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            bridgeId,
            parseInteger(row.MAIN_UNIT_SPANS_045),
            parseDecimal(row.STRUCTURE_LEN_MT_049),
            parseDecimal(row.MAX_SPAN_LEN_MT_048),
            parseDecimal(row.ROADWAY_WIDTH_MT_051),
            parseDecimal(row.DECK_WIDTH_MT_052),
          ]
        )

        // Insert data into the condition_ratings table
        await pool.query(
          `INSERT INTO condition_ratings (bridge_id, deck_condition, superstructure_cond, substructure_cond, channel_cond, culvert_cond)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            bridgeId,
            parseInteger(row.DECK_COND_058),
            parseInteger(row.SUPERSTRUCTURE_COND_059),
            parseInteger(row.SUBSTRUCTURE_COND_060),
            parseInteger(row.CHANNEL_COND_061),
            parseInteger(row.CULVERT_COND_062),
          ]
        )

        // Insert data into the inspection_data table
        await pool.query(
          `INSERT INTO inspection_data (bridge_id, date_of_inspect, inspect_freq_months, fracture_critical, underwater_inspect, special_inspect)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            bridgeId,
            row.DATE_OF_INSPECT_090 ? new Date(row.DATE_OF_INSPECT_090) : null,
            parseInteger(row.INSPECT_FREQ_MONTHS_091),
            row.FRACTURE_092A === 'Y',
            row.UNDWATER_LOOK_SEE_092B === 'Y',
            row.SPEC_INSPECT_092C === 'Y',
          ]
        )
      } catch (error) {
        console.error('Error inserting row:', error) // Log any errors in the insertion process
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed') // Log when CSV processing completes
    })
}

// Run the loadCSVData function and catch any errors in the script
loadCSVData().catch((error) => console.error('Error loading CSV data:', error))
