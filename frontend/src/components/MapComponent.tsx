import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

interface Bridge {
  bridge_id: number;
  latitude: number;
  longitude: number;
  structure_length_mt?: number;
  roadway_width_mt?: number;
  superstructure_cond?: number;
  substructure_cond?: number;
}

const MapComponent: React.FC = () => {
  const [bridgeLocations, setBridgeLocations] = useState<Bridge[]>([]);
  const [hoveredBridge, setHoveredBridge] = useState<Bridge | null>(null);
  const [showClusters, setShowClusters] = useState(true);

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

  // Convert bridge data to GeoJSON format for clustering
  const bridgeLocationsGeoJSON = {
    type: 'FeatureCollection',
    features: bridgeLocations.map((bridge) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [bridge.longitude, bridge.latitude],
      },
      properties: {
        bridge_id: bridge.bridge_id,
      },
    })),
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Checkbox for toggling clusters */}
      <label style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, backgroundColor: 'white', padding: '5px' }}>
        <input
          type="checkbox"
          checked={showClusters}
          onChange={() => setShowClusters(!showClusters)}
        />
        Show Clusters
      </label>

      <Map
        initialViewState={{
          longitude: -76.8867,
          latitude: 40.2732,
          zoom: 7,
        }}
        style={{ width: '100%', height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Conditionally render the cluster layers */}
        {showClusters && (
          <Source
            id="bridges"
            type="geojson"
            data={bridgeLocationsGeoJSON}
            cluster={true}
            clusterMaxZoom={10}
            clusterRadius={50}
          >
            <Layer
              id="clusters"
              type="circle"
              filter={['has', 'point_count']}
              paint={{
                'circle-color': '#FF5733',
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  15,
                  10, 20,
                  50, 30,
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FFFFFF',
              }}
            />
            <Layer
              id="cluster-count"
              type="symbol"
              filter={['has', 'point_count']}
              layout={{
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
              }}
              paint={{
                'text-color': '#FFFFFF',
              }}
            />
            <Layer
              id="unclustered-point"
              type="circle"
              filter={['!', ['has', 'point_count']]}
              paint={{
                'circle-color': '#007cbf',
                'circle-radius': 8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FFFFFF',
              }}
            />
          </Source>
        )}

        {/* Individual markers for bridges when clustering is off */}
        {!showClusters &&
          bridgeLocations.map((bridge) => (
            <Marker
              key={bridge.bridge_id}
              longitude={bridge.longitude}
              latitude={bridge.latitude}
              anchor="bottom"
            >
              <div
                onMouseEnter={() => setHoveredBridge(bridge)}
                onMouseLeave={() => setHoveredBridge(null)}
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                }}
              />
            </Marker>
          ))}

        {/* Popup for displaying bridge details on hover */}
        {hoveredBridge && (
          <Popup
            longitude={hoveredBridge.longitude}
            latitude={hoveredBridge.latitude}
            anchor="top"
            closeButton={false}
            closeOnClick={false}
          >
            <div>
              <h4>Bridge Details</h4>
              <p>Structure Length (m): {hoveredBridge.structure_length_mt}</p>
              <p>Roadway Width (m): {hoveredBridge.roadway_width_mt}</p>
              <p>Superstructure Condition: {hoveredBridge.superstructure_cond}</p>
              <p>Substructure Condition: {hoveredBridge.substructure_cond}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
