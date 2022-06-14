import { useMap } from "react-leaflet";

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default ChangeView;