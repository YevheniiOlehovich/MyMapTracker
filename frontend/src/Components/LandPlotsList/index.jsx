import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useRent2026Data } from "../../hooks/useRent2026";
import { setMapCenter } from "../../store/mapCenterSlice";
import { setSelectedCadastre } from "../../store/selectedCadastreSlice";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; 

import { openAddLandPlotModal } from "../../store/modalSlice";

import {
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
  Slide,
  TextField,
  InputAdornment,
} from "@mui/material";

import {
  AccountTree,
  LocationOn,
  Search,
} from "@mui/icons-material";

import L from "leaflet";

export default function LandPlotsList({ open = true }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const {
    data: rent2026Data = [],
    isLoading,
    isError,
    error,
  } = useRent2026Data();

  const handleEdit = (plot) => {
    dispatch(openAddLandPlotModal(plot));
  };

  const filteredData = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return rent2026Data;

    return rent2026Data.filter((item) => {
      return (
        (item.plot?.cadnum || "").toLowerCase().includes(value) ||
        (item.source || "").toLowerCase().includes(value) ||
        (item.owner?.name || "").toLowerCase().includes(value)
      );
    });
  }, [rent2026Data, search]);

  const handleCenterMap = (item) => {
    if (
      !item.geometry ||
      !item.geometry.type ||
      !item.geometry.coordinates?.length
    ) {
      return;
    }

    const feature = {
      type: "Feature",
      geometry: item.geometry,
      properties: {
        ...item,
        cadnum: item.plot?.cadnum,
        area: item.plot?.area,
        source: item.source,
        owner: item.owner,
        name: `${item.plot?.cadnum || "Без номера"} | ${
          item.plot?.area || 0
        } га`,
      },
    };

    const bounds = L.geoJSON(feature).getBounds();

    if (!bounds.isValid()) return;

    const center = bounds.getCenter();

    dispatch(setMapCenter([center.lat, center.lng]));
    dispatch(setSelectedCadastre(feature));
  };

  if (isLoading) {
    return (
      <Typography sx={{ p: 2 }}>
        Завантаження земельних ділянок...
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
            Земельні ділянки
          </Typography>

          <Tooltip title="Земельний банк">
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
            placeholder="Пошук..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "gray" }} />
                </InputAdornment>
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
          {filteredData.length === 0 && (
            <Typography
              sx={{
                fontSize: 12,
                opacity: 0.7,
              }}
            >
              Земельні ділянки не знайдені.
            </Typography>
          )}

          {filteredData.map((item) => (
            <Paper
              key={item._id}
              sx={{
                px: 1,
                py: 0.6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                mb: 0.4,
                transition: "background 0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              {/* INFO */}
              <Typography
                sx={{
                  flex: 1,
                  pr: 1,
                  fontSize: 12,
                  color: "white",
                  lineHeight: 1.45,
                }}
              >
                <b>
                  {item.plot?.cadnum || "Без номера"}
                </b>

                <br />

                {item.plot?.area || 0} га

                <br />

                <span
                  style={{
                    color: "#bdbdbd",
                  }}
                >
                  {item.source}
                </span>

                <br />

                <span
                  style={{
                    color: "#90caf9",
                  }}
                >
                  {item.owner?.name}
                </span>
              </Typography>

              {/* ACTION */}
              <Box
                sx={{
                  display: "flex",
                  gap: 0.3,
                }}
              >

                <Tooltip title="Редагувати ділянку">
                  <IconButton
                      size="small"
                      sx={{ p: 0.4 }}
                      onClick={() => handleEdit(item)}
                  >
                      <EditOutlinedIcon
                          sx={{
                              fontSize: 18,
                              color: "white",
                          }}
                      />
                  </IconButton>
              </Tooltip>

                <Tooltip title="Центрувати ділянку">
                  <span>
                    <IconButton
                      size="small"
                      sx={{ p: 0.4 }}
                      onClick={() => handleCenterMap(item)}
                      disabled={
                        !item.geometry?.type ||
                        !item.geometry?.coordinates?.length
                      }
                    >
                      <LocationOn
                        sx={{
                          fontSize: 18,
                          color:
                            item.geometry?.type &&
                            item.geometry?.coordinates?.length
                              ? "white"
                              : "gray",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Slide>
  );
}