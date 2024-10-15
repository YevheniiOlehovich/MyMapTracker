import { useJsApiLoader, GoogleMap, Polygon } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { my_Api_key, center } from '../../helpres/index';
import { StyledWrapper } from './styled';

export default function Map() {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: my_Api_key,
    });

    const [map, setMap] = useState(null);
    const [polygons, setPolygons] = useState([]); // Масив для зберігання полігонів

    // Функція для створення полігону
    const createPolygon = (coordinates, strokeColor, fillColor) => {
        return new window.google.maps.Polygon({
            paths: coordinates,
            strokeColor: strokeColor,
            strokeOpacity: 1.0,
            strokeWeight: 2,
            fillColor: fillColor,
            fillOpacity: 0.35,
        });
    };

    useEffect(() => {
        if (map) {
            // Визначаємо координати полігонів
            const baseCoordinates = [
                { lat: center.lat + 0.01796 / 2, lng: center.lng - 0.02791 / 2 }, 
                { lat: center.lat + 0.01796 / 2, lng: center.lng + 0.02791 / 2 }, 
                { lat: center.lat - 0.01796 / 2, lng: center.lng + 0.02791 / 2 },
                { lat: center.lat - 0.01796 / 2, lng: center.lng - 0.02791 / 2 },
                { lat: center.lat + 0.01796 / 2, lng: center.lng - 0.02791 / 2 }, // Замикання полігону
            ];

            const coordinates1 = baseCoordinates; // Перший полігон
            const coordinates2 = baseCoordinates.map(coord => ({
                lat: coord.lat + 0.02, // Зсуваємо другий полігон вниз на 0.02
                lng: coord.lng,
            })); // Другий полігон

            // Створюємо полігони
            const newPolygons = [
                createPolygon(coordinates1, "#FF0000", "#FF0000"),
                createPolygon(coordinates2, "#0000FF", "#0000FF"),
            ];

            setPolygons(newPolygons); // Зберігаємо полігони в стані

            // Додаємо полігони на карту
            newPolygons.forEach(polygon => polygon.setMap(map));
        }
    }, [map]);

    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <StyledWrapper>
            <GoogleMap
                onLoad={onLoad}
                center={center}  // Центр карти
                zoom={12} // Масштаб
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                    mapTypeId: "terrain", // Тип карти
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            />
        </StyledWrapper>
    );
}


