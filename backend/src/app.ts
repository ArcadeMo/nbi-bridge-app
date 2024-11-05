import express from 'express';
import dotenv from 'dotenv';

import bridgesRoutes from './routes/bridges';
import locationDataRoutes from './routes/locationData';
import structureDetailsRoutes from './routes/structureDetails';
import conditionRatingsRoutes from './routes/conditionRatings';
import inspectionDataRoutes from './routes/inspectionData';
import bridgeDetailsRoutes from './routes/bridgeDetails'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running!' });
});

app.use('/api/bridges', bridgesRoutes);
app.use('/api/location-data', locationDataRoutes);
app.use('/api/structure-details', structureDetailsRoutes);
app.use('/api/condition-ratings', conditionRatingsRoutes);
app.use('/api/inspection-data', inspectionDataRoutes);
app.use('/api/bridge-details', bridgeDetailsRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
