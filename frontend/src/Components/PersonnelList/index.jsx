import { useDispatch, useSelector } from "react-redux";
import { usePersonnelData, useDeletePersonnel } from "../../hooks/usePersonnelData";
import { useGroupsData } from "../../hooks/useGroupsData";
import { openAddPersonalModal } from "../../store/modalSlice";
import { IconButton, Box, Paper, Typography, Tooltip, Slide } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionIco from '../../assets/ico/10965421.webp';
import { BACKEND_URL } from "../../helpres";

export default function PersonnelList({ open = true }) {
  const dispatch = useDispatch();
  const { data: personnel = [], isLoading, isError, error } = usePersonnelData();
  const { data: groups = [] } = useGroupsData();
  const deletePersonnel = useDeletePersonnel();

  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const handleEdit = (id) =>
    dispatch(openAddPersonalModal({ personId: id }));

  const handleAdd = () => {
    if (isGuest) return;
    dispatch(openAddPersonalModal());
  };

  const handleDelete = (id) => {
    if (isGuest) return;
    deletePersonnel.mutate(id);
  };

  const getGroupName = (groupId) => {
    const group = groups.find((g) => g._id === groupId);
    return group ? group.name : "Без групи";
  };

  if (isLoading)
    return <Typography sx={{ p: 2 }}>Завантаження персоналу...</Typography>;

  if (isError)
    return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;

  // 🔹 групування
  const groupedByGroup = personnel.reduce((acc, person) => {
    const key = person.groupId || "noGroup";
    if (!acc[key]) acc[key] = [];
    acc[key].push(person);
    return acc;
  }, {});

  return (
    <Slide direction="right" in={open} mountOnEnter unmountOnExit>
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
        {/* 🔹 HEADER */}
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
          <Typography variant="subtitle1" fontWeight="bold">
            Персонал
          </Typography>

          <Tooltip
            title={
              isGuest
                ? "Недоступно для гостей"
                : "Додати персонал"
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
                  sx={{ color: isGuest ? "gray" : "white" }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* 🔹 LIST */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
          {personnel.length === 0 && (
            <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
              Персонал не знайдено
            </Typography>
          )}

          {Object.entries(groupedByGroup).map(([groupId, people]) => (
            <Box key={groupId}>
              {/* Назва групи */}
              <Typography
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                  mb: 0.4,
                  fontSize: 12,
                  opacity: 0.8,
                }}
              >
                {getGroupName(groupId)}
              </Typography>

              {people.map((person) => {
                const imgSrc = person.photoPath
                  ? `/uploads/${person.photoPath
                      .replace(/\\/g, "/")
                      .split("uploads/")[1]}`
                  : QuestionIco;

                return (
                  <Paper
                    key={person._id}
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
                        bgcolor: "rgba(25,118,210,0.2)",
                      },
                    }}
                  >
                    {/* 🔹 Фото + ім'я */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                      }}
                    >
                      <Box
                        component="img"
                        src={imgSrc}
                        alt={person.firstName}
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: 1,
                          objectFit: "cover",
                        }}
                      />

                      <Typography sx={{ fontSize: 12, color: "white" }}>
                        {person.lastName} {person.firstName}
                      </Typography>
                    </Box>

                    {/* 🔹 Actions */}
                    <Box sx={{ display: "flex", gap: 0.3 }}>
                      <Tooltip title="Редагувати">
                        <IconButton
                          size="small"
                          sx={{ p: 0.4 }}
                          onClick={() => handleEdit(person._id)}
                        >
                          <EditIcon
                            sx={{ fontSize: 16, color: "white" }}
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
                            sx={{ p: 0.4 }}
                            onClick={() =>
                              handleDelete(person._id)
                            }
                            disabled={isGuest}
                          >
                            <DeleteIcon
                              sx={{
                                fontSize: 16,
                                color: isGuest
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
          ))}
        </Box>
      </Paper>
    </Slide>
  );
}