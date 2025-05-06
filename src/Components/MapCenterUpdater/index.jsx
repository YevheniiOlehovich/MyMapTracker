import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { selectMapCenter } from '../../store/mapCenterSlice';

const MapCenterUpdater = () => {
    const map = useMap();
    const mapCenter = useSelector(selectMapCenter);

    useEffect(() => {
        if (mapCenter) {
            map.setView(mapCenter);
        }
    }, [map, mapCenter]);

    return null;
};

export default MapCenterUpdater;