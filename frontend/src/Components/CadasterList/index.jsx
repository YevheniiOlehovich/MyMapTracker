import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useCadastreData } from "../../hooks/useCadastreData";
import { setMapCenter } from "../../store/mapCenterSlice";
import { setSelectedCadastre } from "../../store/selectedCadastreSlice";

import {
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
  Slide,
  TextField,
} from "@mui/material";

import {
  AccountTree,
  LocationOn,
  Search,
} from "@mui/icons-material";

import L from "leaflet";

export default function CadasterList({ open = true }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const {
    data: cadastreData = [],
    isLoading,
    isError,
    error,
  } = useCadastreData();

  const handleCenterMap = (cadastre) => {
    const bounds = L.geoJSON(cadastre).getBounds();
    const center = bounds.getCenter();

    dispatch(setMapCenter([center.lat, center.lng]));
    dispatch(setSelectedCadastre(cadastre));
  };

  const filteredCadastreData = useMemo(() => {
    return cadastreData.filter((cadastre) =>
      cadastre?.properties?.cadnum
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [cadastreData, search]);

  if (isLoading) {
    return (
      <Typography sx={{ p: 2 }}>
        Завантаження кадастрових ділянок...
      </Typography>
    );
  }

  if (isError) {
    return (
      <Typography sx={{ p: 2 }}>
        Помилка: {error?.message}
      </Typography>
    );
  }

  return (
    <Slide
      direction="right"
      in={open}
      mountOnEnter
      unmountOnExit
    >
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 350,
          height: "100vh",
          bgcolor: "rgba(33,33,33,0.85)",
          color: "white",
          borderRadius: "0 8px 8px 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
            py: 0.5,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
          >
            Кадастрові ділянки
          </Typography>

          <Tooltip title="Кадастр">
            <IconButton size="small">
              <AccountTree
                fontSize="small"
                sx={{ color: "white" }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* SEARCH */}
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Пошук по кадастровому номеру..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <Search
                  sx={{
                    mr: 1,
                    color: "gray",
                  }}
                />
              ),
            }}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
            }}
          />
        </Box>

        {/* LIST */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 1,
          }}
        >
          {filteredCadastreData.length === 0 && (
            <Typography
              sx={{
                fontSize: 12,
                opacity: 0.7,
              }}
            >
              Кадастрові ділянки не знайдені.
            </Typography>
          )}

          {filteredCadastreData.map((cadastre) => (
            <Paper
              key={cadastre._id}
              sx={{
                px: 1,
                py: 0.6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor:
                  "rgba(255,255,255,0.05)",
                borderRadius: 1,
                mb: 0.4,
                transition: "background 0.2s",
                "&:hover": {
                  bgcolor:
                    "rgba(255,255,255,0.12)",
                },
              }}
            >
              {/* INFO */}
              <Typography
                sx={{
                  fontSize: 12,
                  color: "white",
                  maxWidth: 240,
                  lineHeight: 1.4,
                }}
              >
                {cadastre?.properties?.cadnum || "Без номера"}
                <br />
                {cadastre?.properties?.area || 0} га
              </Typography>

              {/* ACTION */}
              <Box
                sx={{
                  display: "flex",
                  gap: 0.3,
                }}
              >
                <Tooltip title="Центрувати та показати">
                  <IconButton
                    size="small"
                    sx={{ p: 0.4 }}
                    onClick={() =>
                      handleCenterMap(cadastre)
                    }
                  >
                    <LocationOn
                      sx={{
                        fontSize: 18,
                        color: "white",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Slide>
  );
}