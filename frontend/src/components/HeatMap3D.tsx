import React, { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const HeatMap3D: React.FC = () => {
  // Define multiple circles with locations, colors, and initial radius sizes
  const [circleData, setCircleData] = useState({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-76.8867, 40.932] }, // Central PA
        properties: { radius: 40, color: '#FFA500' }, // Orange
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-78.5, 41.5] }, // Farther west
        properties: { radius: 50, color: '#FF4500' }, // Red-orange
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-75.0, 40.8] }, // East, closer to Philly
        properties: { radius: 35, color: '#FFFF00' }, // Yellow
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-76.7, 42.0] }, // Far north
        properties: { radius: 45, color: '#008000' }, // Green
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-76.7, 39.7] }, // Far south
        properties: { radius: 55, color: '#FF0000' }, // Red
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-76.5, 41.0] }, // Additional center PA
        properties: { radius: 30, color: '#FFD700' }, // Gold
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-77.3, 40.5] }, // West-central PA
        properties: { radius: 35, color: '#FF6347' }, // Tomato
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-75.5, 39.9] }, // Southeastern PA
        properties: { radius: 45, color: '#ADFF2F' }, // Green-yellow
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-76.2, 41.3] }, // Northern central PA
        properties: { radius: 50, color: '#FF8C00' }, // Dark orange
      },
    ],
  });

  // Pulsing effect for circle radius
  useEffect(() => {
    const interval = setInterval(() => {
      setCircleData((prevData) => ({
        ...prevData,
        features: prevData.features.map((circle) => ({
          ...circle,
          properties: {
            ...circle.properties,
            radius:
              circle.properties.radius > 60
                ? 40
                : circle.properties.radius + 2, // Adjust radius for pulsing
          },
        })),
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: -76.8867,
        latitude: 40.2732,
        zoom: 6, // Zoom out slightly for a better view of spread-out circles
        pitch: 60, // For a 3D effect
        bearing: -15,
      }}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* Source and Layer for animated, gradient 3D circles */}
      <Source id="circle-3d" type="geojson" data={circleData}>
        <Layer
          id="circle-3d-layer"
          type="circle"
          paint={{
            'circle-radius': ['get', 'radius'], // Dynamic radius based on data
            'circle-color': ['get', 'color'], // Use individual colors
            'circle-opacity': 0.6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF',
          }}
        />
      </Source>
    </Map>
  );
};

export default HeatMap3D;
