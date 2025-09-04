import React from "react";
import Select from "react-select";
import { useTheme } from "@mui/material/styles";

export default function SelectComponent({ options, value, onChange, placeholder }) {
  const theme = useTheme();

  const transformedOptions = options.map((group) => ({
    value: group._id,
    label: group.name,
  }));

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: theme.shape.borderRadius,
      borderColor: state.isFocused
        ? theme.palette.primary.main
        : theme.palette.grey[400],
      boxShadow: state.isFocused
        ? `0 0 0 2px ${theme.palette.primary.light}`
        : "none",
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
      minHeight: 40,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
    }),
    input: (base) => ({
      ...base,
      fontSize: 14,
      color: theme.palette.text.primary,
    }),
    placeholder: (base) => ({
      ...base,
      color: theme.palette.text.secondary,
    }),
    singleValue: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      fontSize: 14,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      marginTop: 4,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: 14,
      backgroundColor: state.isSelected
        ? theme.palette.primary.main
        : state.isFocused
        ? theme.palette.action.hover
        : "transparent",
      color: state.isSelected
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
      cursor: "pointer",
      "&:active": {
        backgroundColor: theme.palette.action.selected,
      },
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused
        ? theme.palette.primary.main
        : theme.palette.action.active,
      "&:hover": {
        color: theme.palette.primary.main,
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div style={{ width: "300px", margin: "0" }}>
      <Select
        value={value}
        onChange={onChange}
        options={transformedOptions}
        placeholder={placeholder}
        isLoading={options.length === 0}
        styles={customStyles} // 🔥 підключаємо стилі
        menuPortalTarget={document.body} // щоб меню не обрізалося контейнером
      />
    </div>
  );
}
