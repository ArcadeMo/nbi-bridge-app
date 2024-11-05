// controllers/bridgeDetailsController.ts
import { Request, Response } from 'express';
import pool from '../db';

// Controller to get combined bridge data
export const getBridgeDetails = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        l.bridge_id, 
        l.latitude, 
        l.longitude,
        s.structure_length_mt, 
        s.roadway_width_mt,
        c.superstructure_cond, 
        c.substructure_cond
      FROM location_data l
      LEFT JOIN structure_details s ON l.bridge_id = s.bridge_id
      LEFT JOIN condition_ratings c ON l.bridge_id = c.bridge_id;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bridge details:', error);
    res.status(500).json({ error: 'Failed to fetch bridge details' });
  }
};
