// import { useJsApiLoader, GoogleMap, Polygon } from "@react-google-maps/api";
// import { useState, useEffect } from "react";
// import { my_Api_key, center } from '../../helpres/index';
// import { StyledWrapper } from './styled';

// export default function Map() {
//     const { isLoaded } = useJsApiLoader({
//         id: "google-map-script",
//         googleMapsApiKey: my_Api_key,
//     });

//     const [map, setMap] = useState(null);
//     const [polygons, setPolygons] = useState([]); // Масив для зберігання полігонів

//     // Функція для створення полігону
//     const createPolygon = (coordinates, strokeColor, fillColor) => {
//         return new window.google.maps.Polygon({
//             paths: coordinates,
//             strokeColor: strokeColor,
//             strokeOpacity: 1.0,
//             strokeWeight: 2,
//             fillColor: fillColor,
//             fillOpacity: 0.35,
//         });
//     };

//     useEffect(() => {
//         if (map) {
//             // Визначаємо координати полігонів
//             const baseCoordinates = [
//                 { lat: center.lat + 0.01796 / 2, lng: center.lng - 0.02791 / 2 }, 
//                 { lat: center.lat + 0.01796 / 2, lng: center.lng + 0.02791 / 2 }, 
//                 { lat: center.lat - 0.01796 / 2, lng: center.lng + 0.02791 / 2 },
//                 { lat: center.lat - 0.01796 / 2, lng: center.lng - 0.02791 / 2 },
//                 { lat: center.lat + 0.01796 / 2, lng: center.lng - 0.02791 / 2 }, // Замикання полігону
//             ];

//             const coordinates1 = baseCoordinates; // Перший полігон
//             const coordinates2 = baseCoordinates.map(coord => ({
//                 lat: coord.lat + 0.02, // Зсуваємо другий полігон вниз на 0.02
//                 lng: coord.lng,
//             })); // Другий полігон

//             // Створюємо полігони
//             const newPolygons = [
//                 createPolygon(coordinates1, "#FF0000", "#FF0000"),
//                 createPolygon(coordinates2, "#0000FF", "#0000FF"),
//             ];

//             setPolygons(newPolygons); // Зберігаємо полігони в стані

//             // Додаємо полігони на карту
//             newPolygons.forEach(polygon => polygon.setMap(map));
//         }
//     }, [map]);

//     const onLoad = (mapInstance) => {
//         setMap(mapInstance);
//     };

//     if (!isLoaded) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <StyledWrapper>
//             <GoogleMap
//                 onLoad={onLoad}
//                 center={center}  // Центр карти
//                 zoom={12} // Масштаб
//                 mapContainerStyle={{ width: "100%", height: "100%" }}
//                 options={{
//                     mapTypeId: "terrain", // Тип карти
//                     zoomControl: true,
//                     streetViewControl: false,
//                     mapTypeControl: false,
//                     fullscreenControl: false,
//                 }}
//             />
//         </StyledWrapper>
//     );
// }


import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import Styles from './styled';
import { google_map_api } from '../../helpres';

export default function Map() {
    // Дані для полігонів
    const polygonsData = [
        {
            coordinates: [
                [50.68, 32.12],
                [50.70, 32.15],
                [50.67, 32.18],
                [50.68, 32.12],
            ],
            name: 'Полігон 1',
            description: [
                'Перша строчка тексту',
                'Друга строчка тексту',
                'Третя строчка тексту',
            ],
            color: 'blue',
        },
        {
            coordinates: [
                [50.65, 32.10],
                [50.66, 32.14],
                [50.63, 32.16],
                [50.65, 32.10],
            ],
            name: 'Полігон 2',
            description: [
                'Це опис для другого полігону',
                'Додаткова інформація',
                'Заключна строчка тексту',
            ],
            color: 'green',
        },
    ];

    return (
        <Styles.wrapper>
            <MapContainer
                center={[50.68, 32.12]}
                zoom={13}
                attributionControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                easeLinearity={0.8}
                style={{ height: '100vh', width: '100%' }}
            >
                <TileLayer
                    url={`https://{s}.google.com/maps/vt?lyrs=m&x={x}&y={y}&z={z}&key=${google_map_api}`}
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />
                {/* Рендеримо полігони */}
                {polygonsData.map((polygon, index) => (
                    <Polygon
                        key={index}
                        positions={polygon.coordinates}
                        pathOptions={{ color: polygon.color }}
                    >
                        <Popup>
                            <div>
                                <h3>{polygon.name}</h3>
                                {polygon.description.map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </Popup>
                    </Polygon>
                ))}
            </MapContainer>
        </Styles.wrapper>
    );
}
