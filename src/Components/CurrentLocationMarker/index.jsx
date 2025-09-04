// components/CurrentLocationMarker.jsx
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import RedMarker from '../../assets/ico/redmarker.png';

export default function CurrentLocationMarker({ position }) {
    if (!position) return null;

    const icon = L.icon({
        iconUrl: RedMarker,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
    });

    return (
        <Marker position={position} icon={icon}>
            <Popup>Ви тут!</Popup>
        </Marker>
    );
}
