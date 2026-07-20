import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGroupsData, useUpdateGroup, useSaveGroup } from "../../hooks/useGroupsData";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Tooltip,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddGroupModal({ onClose }) {
  const { data: groups = [] } = useGroupsData();
  const updateGroup = useUpdateGroup();
  const saveGroup = useSaveGroup();

  // ✅ слухаємо роль з Redux
  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const editGroupId = useSelector((state) => state.modals.editGroupId);
  const editGroup = groups.find((group) => group._id === editGroupId);

  const [groupName, setGroupName] = useState(editGroup ? editGroup.name : "");
  const [groupOwnership, setGroupOwnership] = useState(editGroup ? editGroup.ownership : "");
  const [groupDescription, setGroupDescription] = useState(editGroup ? editGroup.description : "");

  useEffect(() => {
    if (editGroup) {
      setGroupName(editGroup.name);
      setGroupOwnership(editGroup.ownership);
      setGroupDescription(editGroup.description);
    }
  }, [editGroup]);

  const handleSave = () => {
    if (isGuest) return; // підстраховка на всяк випадок

    const groupData = { name: groupName, ownership: groupOwnership, description: groupDescription };

    if (editGroupId) {
      updateGroup.mutate(
        { groupId: editGroupId, groupData },
        { onSuccess: onClose, onError: (err) => console.error(err) }
      );
    } else {
      saveGroup.mutate(groupData, { onSuccess: onClose, onError: (err) => console.error(err) });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}>
        {editGroupId ? "Редагування групи" : "Додавання групи"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            label="Назва групи"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
            size="small"
            disabled={isGuest}
          />
          <TextField
            label="Приналежність групи"
            value={groupOwnership}
            onChange={(e) => setGroupOwnership(e.target.value)}
            fullWidth
            size="small"
            disabled={isGuest}
          />
          <TextField
            label="Опис групи"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
            fullWidth
            size="small"
            disabled={isGuest}
          />
        </Box>

        {isGuest && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            Ви не маєте прав для редагування або створення груп.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 2, py: 1 }}>
        <Tooltip title={isGuest ? "У вас немає прав на цю дію" : ""}>
          <span>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              sx={{ textTransform: "none", px: 2, py: 0.7 }}
              disabled={isGuest}
            >
              Зберегти
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
