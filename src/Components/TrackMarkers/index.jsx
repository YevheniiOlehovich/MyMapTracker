import React, { useMemo } from 'react';
import { Marker, Polyline, Popup } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setImei, toggleShowTrack } from '../../store/vehicleSlice';
import { haversineDistance } from '../../helpres/distance';

const TrackMarkers = ({ gpsData, selectedDate, selectedImei, showTrack }) => {
    const dispatch = useDispatch();

    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate) return [];
        const selectedDateFormatted = selectedDate.split('T')[0];
        return gpsData.filter(item => item.date === selectedDateFormatted);
    }, [gpsData, selectedDate]);

    const routeCoordinates = useMemo(() => {
        if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
        const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
        if (!selectedVehicleData) return [];
        return selectedVehicleData.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0).map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude]);
    }, [filteredGpsData, selectedImei]);

    const totalDistance = useMemo(() => {
        if (routeCoordinates.length < 2) return 0;

        return routeCoordinates.reduce((sum, coord, index, array) => {
            if (index === 0) return sum;
            const [lat1, lon1] = array[index - 1];
            const [lat2, lon2] = coord;
            return sum + haversineDistance(lat1, lon1, lat2, lon2);
        }, 0).toFixed(2);
    }, [routeCoordinates]);

    const lastGpsPoints = useMemo(() => {
        return filteredGpsData.map(item => {
            const validData = item.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0);
            return validData.length > 0 ? { ...validData[validData.length - 1], imei: item.imei } : null;
        }).filter(point => point !== null);
    }, [filteredGpsData]);

    const handleMarkerClick = (imei) => {
        dispatch(setImei(imei));
        dispatch(toggleShowTrack());
    };

    return (
        <>
            {showTrack && routeCoordinates.length > 0 && (
                <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
            )}

            {lastGpsPoints.map((point, index) => (
                <Marker key={index} position={[point.latitude, point.longitude]} eventHandlers={{ click: () => handleMarkerClick(point.imei) }}>
                    <Popup>
                        <strong>Остання точка</strong> <br />
                        Час: {new Date(point.timestamp).toLocaleString()} <br />
                        IMEI: {point.imei} <br />
                        Пройдено: {totalDistance} км
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default TrackMarkers;