import express from 'express'
import { getLocationData } from '../controllers/locationDataController'

const router = express.Router() // Create a new Express router instance

// Define a GET route at the root path to fetch location data
router.get('/', getLocationData)

export default router // Export the router for use in the main application
