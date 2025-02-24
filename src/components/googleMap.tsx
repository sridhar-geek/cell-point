"use client";
import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

const GoogleMap = () => {
  const [infowindowOpen1, setInfowindowOpen1] = useState(false);
  const [infowindowOpen2, setInfowindowOpen2] = useState(false);
  const [markerRef1, marker1] = useAdvancedMarkerRef();
  const [markerRef2, marker2] = useAdvancedMarkerRef();
  const maduthuru = { lat: 17.5578459, lng: 83.0142087 };
  const atchuthapuram = { lat: 17.5643754, lng: 82.9797491 };

  const google_api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
  const mapId = process.env.NEXT_PUBLIC_MAPID;

  
  return (
    <APIProvider apiKey={google_api_key}>
      <div style={{ height: "100%", width: "100%" }}>
        <Map
          key={mapId}
          zoom={20}
          center={maduthuru}
          mapId={mapId}
          disableDefaultUI={false}
          gestureHandling="auto"
                >
          {/* First Marker */}
          <AdvancedMarker
            ref={markerRef1}
            onClick={() => setInfowindowOpen1(true)}
            position={maduthuru}
            title={"Divya Cell Point Maduthuru"}
          />
          {infowindowOpen1 && (
            <InfoWindow
              anchor={marker1}
              maxWidth={200}
              onCloseClick={() => setInfowindowOpen1(false)}
              style={{ height: "20px" }}
            >
              <div style={{ fontSize: "14px" }}>Divya Cell Point Maduthuru</div>
            </InfoWindow>
          )}

          {/* Second Marker */}
          <AdvancedMarker
            ref={markerRef2}
            onClick={() => setInfowindowOpen2(true)}
            position={atchuthapuram}
            title={"Divya Cell Point Atchuthapuram"}
          />
          {infowindowOpen2 && (
            <InfoWindow
              anchor={marker2}
              maxWidth={200}
              onCloseClick={() => setInfowindowOpen2(false)}
              style={{ height: "20px" }}
            >
              <div style={{ fontSize: "14px" }}>
                Divya Cell Point Atchuthapuram
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;
