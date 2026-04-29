import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAddVehicleModal } from "../../store/modalSlice";
import {
  useVehiclesData,
  useDeleteVehicle,
} from "../../hooks/useVehiclesData";
import { useLastGpsByDate } from "../../hooks/useLastGpsByDate";
import { useGroupsData } from "../../hooks/useGroupsData";
import { setMapCenter } from "../../store/mapCenterSlice";

import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Slide,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";

import QuestionIco from "../../assets/ico/10965421.webp";
import { vehicleTypes } from "../../helpres";

export default function VehicleList({ open = true }) {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { data: vehicles = [], isLoading } =
    useVehiclesData();

  const { data: lastGpsPoints = [] } =
    useLastGpsByDate();

  const { data: groups = [] } =
    useGroupsData();

  const deleteVehicle = useDeleteVehicle();

  const role = useSelector(
    (state) => state.user.role
  );

  const isGuest = role === "guest";

  const handleAdd = () =>
    dispatch(openAddVehicleModal());

  const handleEdit = (id) =>
    dispatch(
      openAddVehicleModal({
        vehicleId: id,
      })
    );

  const handleDelete = (id) =>
    deleteVehicle.mutate(id);

  /*
  ======================================================
  🧠 СТАТУС ТЕХНІКИ
  ======================================================
  */

  const getVehicleStatus = (vehicle) => {
    const point = lastGpsPoints.find(
      (p) => p.imei === vehicle.imei
    );

    if (!point) return 3; // offline

    const diffMinutes =
      (Date.now() -
        new Date(point.timestamp).getTime()) /
      60000;

    if (diffMinutes <= 5) return 1; // online

    return 2; // idle
  };

  const getStatusColor = (status) => {
    if (status === 1) return "#4caf50";
    if (status === 2) return "#ff9800";
    return "#f44336";
  };

  /*
  ======================================================
  🔍 ПОШУК ПО НАЗВІ / РЕЄСТРАЦІЇ
  ======================================================
  */

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) return vehicles;

    const searchValue = search.toLowerCase();

    return vehicles.filter((vehicle) => {
      const mark =
        vehicle?.mark?.toLowerCase() || "";

      const regNumber =
        vehicle?.regNumber?.toLowerCase() || "";

      return (
        mark.includes(searchValue) ||
        regNumber.includes(searchValue)
      );
    });
  }, [vehicles, search]);

  /*
  ======================================================
  🔥 СОРТУВАННЯ
  ======================================================
  */

  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort(
      (a, b) => {
        const statusA = getVehicleStatus(a);
        const statusB = getVehicleStatus(b);

        if (statusA !== statusB) {
          return statusA - statusB;
        }

        return a.mark.localeCompare(b.mark);
      }
    );
  }, [filteredVehicles, lastGpsPoints]);

  /*
  ======================================================
  📦 ГРУПУВАННЯ ПО ТИПУ
  ======================================================
  */

  const groupedByType = vehicleTypes
    .map(({ _id, name }) => ({
      typeId: _id,
      typeName: name,
      vehicles: sortedVehicles.filter(
        (vehicle) =>
          vehicle.vehicleType === _id
      ),
    }))
    .filter(
      (group) => group.vehicles.length > 0
    );

  /*
  ======================================================
  📍 ПОКАЗАТИ ЛОКАЦІЮ
  ======================================================
  */

  const showVehicleLocation = (vehicle) => {
    const point = lastGpsPoints.find(
      (p) => p.imei === vehicle.imei
    );

    if (point) {
      dispatch(
        setMapCenter({
          lat: point.latitude,
          lng: point.longitude,
        })
      );
    }
  };

  /*
  ======================================================
  LOADING
  ======================================================
  */

  if (isLoading) {
    return (
      <Typography sx={{ p: 2 }}>
        Завантаження техніки...
      </Typography>
    );
  }

  /*
  ======================================================
  RENDER
  ======================================================
  */

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
            justifyContent:
              "space-between",
            alignItems: "center",
            px: 1,
            py: 0.5,
            borderBottom:
              "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
          >
            Транспорт
          </Typography>

          <Tooltip
            title={
              isGuest
                ? "Недоступно для гостей"
                : "Додати техніку"
            }
          >
            <span>
              <IconButton
                size="small"
                onClick={handleAdd}
                disabled={isGuest}
              >
                <AddIcon
                  fontSize="small"
                  sx={{
                    color: isGuest
                      ? "gray"
                      : "white",
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* SEARCH */}
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Пошук по назві або номеру..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <SearchIcon
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
          {groupedByType.length === 0 && (
            <Typography
              sx={{
                fontSize: 12,
                opacity: 0.7,
              }}
            >
              Техніку не знайдено
            </Typography>
          )}

          {groupedByType.map(
            ({
              typeId,
              typeName,
              vehicles,
            }) => (
              <Box
                key={typeId}
                sx={{ mb: 2 }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    fontSize: 13,
                    opacity: 0.8,
                  }}
                >
                  {typeName}
                </Typography>

                {vehicles.map((vehicle) => {
                  const status =
                    getVehicleStatus(
                      vehicle
                    );

                  const imgSrc =
                    vehicle.photoPath
                      ? `/uploads/${vehicle.photoPath
                          .replace(
                            /\\/g,
                            "/"
                          )
                          .split(
                            "uploads/"
                          )[1]}`
                      : QuestionIco;

                  return (
                    <Paper
                      key={vehicle._id}
                      sx={{
                        px: 1,
                        py: 0.8,
                        mb: 0.6,
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        bgcolor:
                          "rgba(255,255,255,0.05)",
                        borderRadius: 1,
                        transition:
                          "background 0.2s",
                        "&:hover": {
                          bgcolor:
                            "rgba(25,118,210,0.2)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 0.8,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius:
                              "50%",
                            bgcolor:
                              getStatusColor(
                                status
                              ),
                          }}
                        />

                        <Box
                          component="img"
                          src={imgSrc}
                          alt={vehicle.mark}
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: 1,
                            objectFit:
                              "cover",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "white",
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            lineHeight: 1.2,
                          }}
                        >
                          <span>
                            {vehicle.mark}
                          </span>

                          {vehicle.regNumber && (
                            <span
                              style={{
                                fontSize: 11,
                                opacity: 0.7,
                              }}
                            >
                              {
                                vehicle.regNumber
                              }
                            </span>
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.3,
                        }}
                      >
                        <Tooltip title="Показати локацію">
                          <IconButton
                            size="small"
                            sx={{
                              p: 0.4,
                            }}
                            onClick={() =>
                              showVehicleLocation(
                                vehicle
                              )
                            }
                          >
                            <LocationOnIcon
                              sx={{
                                fontSize: 16,
                                color:
                                  "white",
                              }}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Редагувати">
                          <IconButton
                            size="small"
                            sx={{
                              p: 0.4,
                            }}
                            onClick={() =>
                              handleEdit(
                                vehicle._id
                              )
                            }
                          >
                            <EditIcon
                              sx={{
                                fontSize: 16,
                                color:
                                  "white",
                              }}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            isGuest
                              ? "Недоступно для гостей"
                              : "Видалити"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              sx={{
                                p: 0.4,
                              }}
                              onClick={() =>
                                handleDelete(
                                  vehicle._id
                                )
                              }
                              disabled={
                                isGuest
                              }
                            >
                              <DeleteIcon
                                sx={{
                                  fontSize: 16,
                                  color:
                                    isGuest
                                      ? "gray"
                                      : "white",
                                }}
                              />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )
          )}
        </Box>
      </Paper>
    </Slide>
  );
}