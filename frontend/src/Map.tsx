import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

interface Bridge {
  bridge_id: number;
  latitude: number;
  longitude: number;
}

const MapComponent: React.FC = () => {
  const [bridgeLocations, setBridgeLocations] = useState<Bridge[]>([]);
  const [hoveredBridge, setHoveredBridge] = useState<Bridge | null>(null);
  const [showClusters, setShowClusters] = useState(true); // State to manage cluster visibility

  useEffect(() => {
    const fetchBridgeLocations = async () => {
      try {
        const response = await fetch('/api/location-data');
        const data = await response.json();

        const scaledData = data
          .map((bridge: any) => ({
            bridge_id: bridge.bridge_id,
            latitude: parseFloat(bridge.latitude) / 1000000,
            longitude: -Math.abs(parseFloat(bridge.longitude) / 1000000),
          }))
          .filter(
            (bridge: Bridge) =>
              !isNaN(bridge.latitude) &&
              !isNaN(bridge.longitude) &&
              bridge.latitude >= -90 &&
              bridge.latitude <= 90 &&
              bridge.longitude >= -180 &&
              bridge.longitude <= 0
          );

        setBridgeLocations(scaledData);
      } catch (error) {
        console.error('Error fetching bridge locations:', error);
      }
    };

    fetchBridgeLocations();
  }, []);

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
        {/* Cluster Source - only visible if showClusters is true */}
        {showClusters && (
          <Source
            id="bridges"
            type="geojson"
            data={{
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
            }}
            cluster={true}
            clusterMaxZoom={10}
            clusterRadius={50}
          >
            {/* Cluster circles */}
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
                  10,
                  20,
                  50,
                  30,
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FFFFFF',
              }}
            />
            {/* Cluster count label */}
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
            {/* Unclustered individual points */}
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

        {/* Individual bridge markers - only visible if showClusters is false */}
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

        {/* Hovered Bridge Popup */}
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
              <p>ID: {hoveredBridge.bridge_id}</p>
              {/* Add more bridge details here */}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
