import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GroupMap = ({ location }) => {
  const center = [location.lat, location.lng];
  const points = [
    { id: "group", label: location.name, coords: [location.lat, location.lng], color: "#16a34a", radius: 10 },
    ...location.members.map((member, index) => ({
      id: member.id,
      label: member.name,
      coords: [member.lat, member.lng],
      color: "#22c55e",
      radius: 6,
    })),
  ];

  return (
    <MapContainer center={center} zoom={11} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point) => (
        <CircleMarker
          key={point.id}
          center={point.coords}
          pathOptions={{ color: point.color, fillColor: point.color, fillOpacity: 0.7 }}
          radius={point.radius}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <strong>{point.label}</strong>
              <p>{point.id === "group" ? "Group center" : "Member location"}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default GroupMap;
