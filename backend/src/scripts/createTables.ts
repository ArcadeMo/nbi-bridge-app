import pool from '../db'

// Function to create database tables if they do not already exist
async function createTables() {
    const client = await pool.connect() // Connect to the database
    try {
        await client.query('BEGIN') // Start a transaction

        // Create the 'bridges' table to store bridge-related information
        await client.query(`
            CREATE TABLE IF NOT EXISTS bridges (
                id SERIAL PRIMARY KEY,
                state_code VARCHAR(2),
                structure_number VARCHAR(20) UNIQUE,
                record_type VARCHAR(2),
                route_prefix VARCHAR(2),
                route_number VARCHAR(10)
            );
        `)

        // Create the 'location_data' table to store geographical data related to bridges
        await client.query(`
            CREATE TABLE IF NOT EXISTS location_data (
                bridge_id INT REFERENCES bridges(id),
                latitude DECIMAL(14,6),
                longitude DECIMAL(14,6),
                county_code VARCHAR(3),
                place_code VARCHAR(5),
                highway_district VARCHAR(2),
                PRIMARY KEY (bridge_id)
            );
        `)
        
        // Create the 'structure_details' table to store structural details of bridges
        await client.query(`
            CREATE TABLE IF NOT EXISTS structure_details (
                bridge_id INT REFERENCES bridges(id),
                main_unit_spans INT,
                structure_length_mt DECIMAL(14,6),
                max_span_len_mt DECIMAL(14,6),
                roadway_width_mt DECIMAL(14,6),
                deck_width_mt DECIMAL(14,6),
                PRIMARY KEY (bridge_id)
            );
        `)
          
        // Create the 'condition_ratings' table to store ratings of various bridge conditions
        await client.query(`
            CREATE TABLE IF NOT EXISTS condition_ratings (
                bridge_id INT REFERENCES bridges(id),
                deck_condition INT,
                superstructure_cond INT,
                substructure_cond INT,
                channel_cond INT,
                culvert_cond INT,
                PRIMARY KEY (bridge_id)
            );
        `)

        // Create the 'inspection_data' table to store inspection records of bridges
        await client.query(`
            CREATE TABLE IF NOT EXISTS inspection_data (
                bridge_id INT REFERENCES bridges(id),
                date_of_inspect DATE,
                inspect_freq_months INT,
                fracture_critical BOOLEAN,
                underwater_inspect BOOLEAN,
                special_inspect BOOLEAN,
                PRIMARY KEY (bridge_id)
            );
        `)

        await client.query('COMMIT') // Commit the transaction
        console.log('Tables created successfully')
    } catch (error) {
        await client.query('ROLLBACK') // Rollback transaction in case of error
        console.error('Error creating tables:', error)
    } finally {
        client.release() // Release the database client
    }
}

// Execute the table creation function and catch any errors in the script
createTables().catch((error) => console.error('Script error:', error))
