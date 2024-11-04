// src/routes/inspectionData.ts

import express from 'express'
import { getInspectionData } from '../controllers/inspectionDataController'

const router = express.Router() // Create a new Express router instance

// Define a GET route at the root path to fetch inspection data
router.get('/', getInspectionData)

export default router // Export the router for use in the main application
