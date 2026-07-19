import React from "react";
import { useSelector } from "react-redux";
import FieldLabel from "../FieldLabel";

export default function SelectedCadastreLayer({ zoomLevel }) {
    const selectedCadastre = useSelector(
        (state) => state.selectedCadastre.selectedCadastre
    );

    if (!selectedCadastre) return null;

    return (
        <FieldLabel
            key={
                selectedCadastre._id ||
                selectedCadastre.properties?.cadnum
            }
            feature={selectedCadastre}
            zoomLevel={zoomLevel}
            type="selected-cadastre"
        />
    );
}