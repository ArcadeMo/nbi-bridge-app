import express from 'express';
import { getBridgeDetails } from '../controllers/bridgeDetailsController';

const router = express.Router();

router.get('/', getBridgeDetails);

export default router;
