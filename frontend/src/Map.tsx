import React, { useEffect, useState } from 'react'
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

interface Bridge {
  bridge_id: number
  latitude: number
  longitude: number
  deck_condition?: number // Add more properties as needed for bridge details
}

const MapComponent: React.FC = () => {
  const [bridgeGeoJSON, setBridgeGeoJSON] = useState<any>(null)
  const [selectedBridge, setSelectedBridge] = useState<Bridge | null>(null)

  useEffect(() => {
    const fetchBridgeLocations = async () => {
      try {
        const response = await fetch('/api/location-data')
        const data = await response.json()

        // Convert data to GeoJSON format for clustering
        const geoJSON = {
          type: 'FeatureCollection',
          features: data.map((bridge: any) => ({
            type: 'Feature',
            properties: {
              bridge_id: bridge.bridge_id,
              deck_condition: bridge.deck_condition || 'Unknown' // Modify as needed
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -Math.abs(parseFloat(bridge.longitude) / 1000000),
                parseFloat(bridge.latitude) / 1000000,
              ],
            },
          })),
        }

        setBridgeGeoJSON(geoJSON)
      } catch (error) {
        console.error('Error fetching bridge locations:', error)
      }
    }

    fetchBridgeLocations()
  }, [])

  return (
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
      {/* Source for clustering */}
      {bridgeGeoJSON && (
        <Source
          id="bridges"
          type="geojson"
          data={bridgeGeoJSON}
          cluster={true}
          clusterMaxZoom={14} // Maximum zoom level to cluster points
          clusterRadius={50} // Radius of each cluster in pixels
        >
          {/* Clustered Circle Layer */}
          <Layer
            id="clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1',
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40,
              ],
            }}
          />

          {/* Cluster Count Layer */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}',
              'text-size': 12,
            }}
          />

          {/* Unclustered Points */}
          <Layer
            id="unclustered-point"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': '#11b4da',
              'circle-radius': 6,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            }}
          />
        </Source>
      )}

      {/* Debug marker at the center */}
      <Marker latitude={40.2732} longitude={-76.8867} anchor="bottom">
        <div
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: 'blue',
            borderRadius: '50%',
          }}
        />
      </Marker>

      {/* Popup for Selected Bridge */}
      {selectedBridge && (
        <Popup
          latitude={selectedBridge.latitude}
          longitude={selectedBridge.longitude}
          onClose={() => setSelectedBridge(null)}
        >
          <div>
            <h3>Bridge ID: {selectedBridge.bridge_id}</h3>
            <p>Condition: {selectedBridge.deck_condition || 'Unknown'}</p>
          </div>
        </Popup>
      )}
    </Map>
  )
}

export default MapComponent
