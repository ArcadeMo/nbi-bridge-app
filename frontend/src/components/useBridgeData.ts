import { useState, useEffect } from 'react';
import { Bridge } from './types';

export const useBridgeData = () => {
  const [bridgeLocations, setBridgeLocations] = useState<Bridge[]>([]);

  useEffect(() => {
    const fetchBridgeDetails = async () => {
      try {
        const response = await fetch('/api/bridge-details');
        const data = await response.json();

        const scaledData = data
          .map((bridge: any) => ({
            bridge_id: bridge.bridge_id,
            latitude: parseFloat(bridge.latitude) / 1000000,
            longitude: -Math.abs(parseFloat(bridge.longitude) / 1000000),
            structure_length_mt: bridge.structure_length_mt,
            roadway_width_mt: bridge.roadway_width_mt,
            superstructure_cond: bridge.superstructure_cond,
            substructure_cond: bridge.substructure_cond,
          }))
          .filter((bridge: Bridge) => !isNaN(bridge.latitude) && !isNaN(bridge.longitude));

        setBridgeLocations(scaledData);
      } catch (error) {
        console.error('Error fetching bridge details:', error);
      }
    };

    fetchBridgeDetails();
  }, []);

  return { bridgeLocations };
};
