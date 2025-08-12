import apiRoutes from '../helpres/ApiRoutes';

// Отримати всі таски
export const fetchTasksApi = async () => {
  const response = await fetch(apiRoutes.getTasks);
  if (!response.ok) throw new Error('Не вдалося отримати таски');
  return await response.json();
};

// Створити нову таску
export const saveTaskApi = async (taskData) => {
  console.log(taskData);
  const response = await fetch(apiRoutes.addTask, {
    method: 'POST',
    body: taskData,  // taskData - це FormData
  });
  if (!response.ok) throw new Error('Не вдалося створити таску');
  return await response.json();
};

// Оновити таску
export const updateTaskApi = async ({ taskId, taskData }) => {
  console.log(taskId);
  console.log(taskData);
  const response = await fetch(apiRoutes.updateTask(taskId), {
    method: 'PUT',
    body: taskData,  // FormData
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
