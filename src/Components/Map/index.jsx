import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import { useState } from "react";
import { my_Api_key, center } from '../../helpres/index' 
import { StyledWrapper } from "./styled";

export default function Map() {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: my_Api_key,
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <StyledWrapper>
            <GoogleMap
                center={center}
                zoom={13}
                mapContainerStyle={{ width: "100%", height: "100vh" }}
                options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            />
        </StyledWrapper>
    );
}
