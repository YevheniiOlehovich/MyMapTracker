import apiRoutes from '../helpres/ApiRoutes';

// Отримати всі таски
export const fetchTasksApi = async () => {
  const response = await fetch(apiRoutes.getTasks);
  if (!response.ok) throw new Error('Не вдалося отримати таски');
  return await response.json();
};

// Створити нову таску
export const saveTaskApi = async (taskData) => {
  const response = await fetch(apiRoutes.addTask, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Не вдалося створити таску');
  return await response.json();
};

// Оновити таску
export const updateTaskApi = async ({ taskId, taskData }) => {
  const response = await fetch(apiRoutes.updateTask(taskId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Не вдалося оновити таску');
  return await response.json();
};

// Видалити таску
export const deleteTaskApi = async (taskId) => {
  const response = await fetch(apiRoutes.deleteTask(taskId), {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Не вдалося видалити таску');
  return taskId;
};
