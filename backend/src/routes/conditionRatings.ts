import express from 'express'
import { getConditionRatings } from '../controllers/conditionRatingsController'

const router = express.Router() // Create a new Express router instance

// Define a GET route at the root path to fetch condition ratings data
router.get('/', getConditionRatings)

export default router // Export the router for use in the main application
