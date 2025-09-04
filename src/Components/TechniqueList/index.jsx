import { useDispatch } from "react-redux";
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

export default function TechniqueList({ open = true }) {
  const dispatch = useDispatch();
  const { data: techniques = [], isLoading, isError, error } = useTechniquesData();
  const deleteTechnique = useDeleteTechnique();

  const handleAdd = () => dispatch(openAddTechniqueModal());
  const handleEdit = (id) => dispatch(openAddTechniqueModal({ techniqueId: id }));
  const handleDelete = (id) => deleteTechnique.mutate(id);

  if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження техніки...</Typography>;
  if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
  if (techniques.length === 0) return <Typography sx={{ p: 2 }}>Техніка не знайдена.</Typography>;

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
        {/* Заголовок */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            py: 0.5,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            height: 56,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">Техніка</Typography>
          <Tooltip title="Додати техніку">
            <IconButton size="small" onClick={handleAdd}>
              <AddIcon fontSize="small" sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Список техніки */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 1,
          }}
        >
          {techniques.map((tech) => {
            const imgSrc = tech.photoPath
              ? '/src/' + tech.photoPath.substring(3).replace(/\\/g, '/')
              : QuestionIco;

            return (
              <Paper
                key={tech._id}
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                  transition: "background 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(25,118,210,0.2)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src={imgSrc}
                    alt={tech.name}
                    sx={{ width: 32, height: 32, borderRadius: "20%", objectFit: "cover" }}
                  />
                  <Typography sx={{ color: "white" }}>{tech.name}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Tooltip title="Редагувати">
                    <IconButton size="small" onClick={() => handleEdit(tech._id)}>
                      <EditIcon fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Видалити">
                    <IconButton size="small" onClick={() => handleDelete(tech._id)}>
                      <DeleteIcon fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
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
