import { useDispatch, useSelector } from "react-redux";
import { useTechniquesData, useDeleteTechnique } from "../../hooks/useTechniquesData";
import { openAddTechniqueModal } from "../../store/modalSlice";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Slide
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionIco from "../../assets/ico/10965421.webp";
import { BACKEND_URL } from "../../helpres";

export default function TechniqueList({ open = true }) {
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.user.role);
  const isGuest = userRole === "guest";

  const { data: techniques = [], isLoading, isError, error } = useTechniquesData();
  const deleteTechnique = useDeleteTechnique();

  const handleAdd = () => {
    if (isGuest) return;
    dispatch(openAddTechniqueModal());
  };

  const handleEdit = (id) => {
    dispatch(openAddTechniqueModal({ techniqueId: id }));
  };

  const handleDelete = (id) => {
    if (isGuest) return;
    deleteTechnique.mutate(id);
  };

  if (isLoading)
    return <Typography sx={{ p: 2 }}>Завантаження техніки...</Typography>;

  if (isError)
    return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;

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
            Техніка
          </Typography>

          <Tooltip title={isGuest ? "Недоступно для гостей" : "Додати техніку"}>
            <span>
              <IconButton size="small" onClick={handleAdd} disabled={isGuest}>
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
          {techniques.length === 0 && (
            <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
              Техніка не знайдена.
            </Typography>
          )}

          {techniques.map((tech) => {
            const imgSrc = tech.photoPath
              ? `/uploads/${tech.photoPath.replace(/\\/g, "/").split("uploads/")[1]}`
              : QuestionIco;

            return (
              <Paper
                key={tech._id}
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
                {/* 🔹 Left side */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Box
                    component="img"
                    src={imgSrc}
                    alt={tech.name}
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: 1,
                      objectFit: "cover",
                    }}
                  />

                  <Typography sx={{ fontSize: 12, color: "white" }}>
                    {tech.name}
                  </Typography>
                </Box>

                {/* 🔹 Actions */}
                <Box sx={{ display: "flex", gap: 0.3 }}>
                  <Tooltip title="Редагувати">
                    <IconButton
                      size="small"
                      sx={{ p: 0.4 }}
                      onClick={() => handleEdit(tech._id)}
                    >
                      <EditIcon sx={{ fontSize: 16, color: "white" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={isGuest ? "Недоступно для гостей" : "Видалити"}
                  >
                    <span>
                      <IconButton
                        size="small"
                        sx={{ p: 0.4 }}
                        onClick={() => handleDelete(tech._id)}
                        disabled={isGuest}
                      >
                        <DeleteIcon
                          sx={{
                            fontSize: 16,
                            color: isGuest ? "gray" : "white",
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
      </Paper>
    </Slide>
  );
}