import express from 'express'
import { getStructureDetails } from '../controllers/structureDetailsController'

const router = express.Router() // Create a new Express router instance

// Define a GET route at the root path to fetch structure details data
router.get('/', getStructureDetails)

export default router // Export the router for use in the main application
