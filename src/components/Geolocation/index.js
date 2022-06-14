import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from 'react-leaflet';

function Geolocation() {
  const polyline = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12]
  ];
  return (
    <>
      <MapContainer
        center={center}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {}
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[51.51, -0.1]} />
        <Marker position={[51.51, -0.12]} />

        {/* {position.map (place => (
            <Marker position={position} />
          ))} */}
        <Polyline positions={polyline} />
      </MapContainer>
    </>
  );
}

export default Geolocation;
