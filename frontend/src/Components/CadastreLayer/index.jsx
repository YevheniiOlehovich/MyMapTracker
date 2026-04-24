import React from "react";
import FieldLabel from "../FieldLabel";

export default function CadastreLayer({ cadastreData, zoomLevel }) {
  if (!cadastreData?.length) return null;

  return (
    <>
      {cadastreData.map((cadastre, index) => {
        const updatedFeature = {
          ...cadastre,
          properties: {
            ...cadastre.properties,
            name: `${cadastre?.properties?.cadnum || "Без номера"} | ${
              cadastre?.properties?.area || "Без площі"
            } га`,
          },
        };

        return (
          <FieldLabel
            key={cadastre._id || index}
            feature={updatedFeature}
            zoomLevel={zoomLevel}
            type="cadastre"
          />
        );
      })}
    </>
  );
}
