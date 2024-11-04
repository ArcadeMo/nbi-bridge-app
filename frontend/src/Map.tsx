import React, { useEffect, useState } from 'react'
import Map, { Marker } from 'react-map-gl' // Import Map and Marker components from react-map-gl
import 'mapbox-gl/dist/mapbox-gl.css' // Import Mapbox CSS for styling

// Mapbox access token from environment variables
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

// Interface for bridge location data
interface Bridge {
  bridge_id: number
  latitude: number
  longitude: number
}

const MapComponent: React.FC = () => {
  const [bridgeLocations, setBridgeLocations] = useState<Bridge[]>([]) // State to store fetched bridge locations

  useEffect(() => {
    // Fetch bridge location data from the backend API
    const fetchBridgeLocations = async () => {
      try {
        const response = await fetch('/api/location-data') // API endpoint for bridge location data
        const data = await response.json()

        // Scale and filter location data to match the map’s coordinate system
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
              bridge.longitude <= 0 // Ensure longitudes are within the Western Hemisphere
          )

        setBridgeLocations(scaledData) // Update state with processed bridge locations
      } catch (error) {
        console.error('Error fetching bridge locations:', error) // Log any fetch errors
      }
    }

    fetchBridgeLocations() // Invoke data fetch on component mount
  }, [])

  return (
    <Map
      initialViewState={{
        longitude: -76.8867, // Initial map center (Pennsylvania)
        latitude: 40.2732,
        zoom: 7,
      }}
      style={{ width: '100%', height: '100vh' }} // Set map size
      mapStyle="mapbox://styles/mapbox/streets-v11" // Mapbox style
      mapboxAccessToken={MAPBOX_TOKEN} // Pass in Mapbox access token
    >
      {bridgeLocations.map((bridge) => (
        // Marker for each bridge location
        <Marker
          key={bridge.bridge_id}
          longitude={bridge.longitude}
          latitude={bridge.latitude}
          anchor="bottom"
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'red',
              borderRadius: '50%', // Circular red marker for bridges
            }}
          />
        </Marker>
      ))}

      {/* Blue dot to indicate the map center */}
      <Marker latitude={40.2732} longitude={-76.8867} anchor="bottom">
        <div
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: 'blue',
            borderRadius: '50%', // Circular blue marker for map center
          }}
        />
      </Marker>
    </Map>
  )
}

export default MapComponent
