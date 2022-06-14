import { useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import { icon } from 'leaflet';
// import L from "leaflet";

const ICON = icon({
  iconUrl: `${process.env.PUBLIC_URL}/static/images/marker/car_soild.png`,
  iconSize: [35, 21]
});

export default function MovingMarker({ data }) {
  const { lat, lng } = data;
  const [prevPos, setPrevPos] = useState([lat, lng]);

  useEffect(() => {
    if (prevPos[1] !== lng && prevPos[0] !== lat) setPrevPos([lat, lng]);
  }, [lat, lng, prevPos]);

  return (
    <>
      {
        data && (
        <LeafletTrackingMarker
          icon={ICON}
          position={[lat, lng]}
          previousPosition={prevPos}
          duration={1200}
        />
        )
      }
    </>
  );
}
