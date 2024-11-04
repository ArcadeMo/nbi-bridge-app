import express from 'express'
// Import the getBridges controller function to handle bridge data retrieval
import { getBridges } from '../controllers/bridgesController'

const router = express.Router() // Create a new Express router instance

// Define a GET route at the root path to fetch bridge data
router.get('/', getBridges)

export default router // Export the router for use in the main application
