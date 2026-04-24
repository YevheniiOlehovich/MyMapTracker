import React from "react";
import { useSelector } from "react-redux";
import FieldLabel from "../FieldLabel";

export default function SelectedCadastreLayer({ zoomLevel }) {
  const selectedCadastre = useSelector(
    (state) => state.selectedCadastre.selectedCadastre
  );

  // якщо нічого не вибрано
  if (!selectedCadastre) return null;

  const updatedFeature = {
    ...selectedCadastre,
    properties: {
      ...selectedCadastre.properties,
      name: `${
        selectedCadastre?.properties?.cadnum || "Без номера"
      } | ${
        selectedCadastre?.properties?.area || "Без площі"
      } га`,
    },
  };

  return (
    <FieldLabel
      key={selectedCadastre._id}
      feature={updatedFeature}
      zoomLevel={zoomLevel}
      type="selected-cadastre"
    />
  );
}