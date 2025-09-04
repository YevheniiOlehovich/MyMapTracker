import { useDispatch } from "react-redux";
import { useGroupsData, useDeleteGroup } from "../../hooks/useGroupsData";
import { openAddGroupModal } from "../../store/modalSlice";
import { IconButton, Box, Paper, Typography, Tooltip, Slide } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function GroupsList({ open = true }) {
  const dispatch = useDispatch();
  const { data: groups = [], isLoading, isError, error } = useGroupsData();
  const deleteGroup = useDeleteGroup();

  const handleDelete = (id) => deleteGroup.mutate(id);
  const handleEdit = (id) => dispatch(openAddGroupModal(id));
  const handleAddGroup = () => dispatch(openAddGroupModal());

  if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження даних...</Typography>;
  if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
  if (groups.length === 0) return <Typography sx={{ p: 2 }}>Групи не знайдено.</Typography>;

  return (
    <Slide direction="right" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 0,
          left: 0, // якщо Aside 60px шириною
          height: "100vh",
          width: 350,
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
          <Typography variant="subtitle1" fontWeight="bold">
            Групи
          </Typography>
          <Tooltip title="Додати групу">
            <IconButton size="small" onClick={handleAddGroup}>
              <AddIcon fontSize="small" sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Список груп */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, flex: 1, overflowY: "auto" }}>
          {groups.map((group) => (
            <Paper
              key={group._id}
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
              <Typography sx={{ color: "white" }}>{group.name}</Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Tooltip title="Редагувати">
                  <IconButton size="small" onClick={() => handleEdit(group._id)}>
                    <EditIcon fontSize="small" sx={{ color: "white" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Видалити">
                  <IconButton size="small" onClick={() => handleDelete(group._id)}>
                    <DeleteIcon fontSize="small" sx={{ color: "white" }} />
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