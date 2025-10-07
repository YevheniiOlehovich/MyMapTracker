import { google_map_api } from './index';

const tileLayerConfig = {
    google_roadmap: {
        url: `https://{s}.google.com/maps/vt?lyrs=m&x={x}&y={y}&z={z}&key=${google_map_api}`,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    google_satellite: {
        url: `https://{s}.google.com/maps/vt?lyrs=s&x={x}&y={y}&z={z}&key=${google_map_api}`,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    google_hybrid: {
        url: `https://{s}.google.com/maps/vt?lyrs=y&x={x}&y={y}&z={z}&key=${google_map_api}`,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    google_terrain: {
        url: `https://{s}.google.com/maps/vt?lyrs=p&x={x}&y={y}&z={z}&key=${google_map_api}`,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    osm: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    osm_hot: {
        url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    },
    osm_topo: {
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        subdomains: ['a', 'b', 'c'],
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
    }
};

export const getTileLayerConfig = (mapType) => {
    return tileLayerConfig[mapType] || null;
};