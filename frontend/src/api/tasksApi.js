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
    body: taskData,  // taskData - це FormData
  });
  if (!response.ok) throw new Error('Не вдалося створити таску');
  return await response.json();
};

// Оновити таску
export const updateTaskApi = async ({ taskId, taskData }) => {
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

export const fetchTasksByDateApi = async (date) => {
  const url = date
    ? `${apiRoutes.getTasks}?date=${date}`
    : apiRoutes.getTasks;

  const response = await fetch(url);

  if (!response.ok)
    throw new Error('Не вдалося отримати таски');

  return await response.json();
};

export const fetchTasksByRangeApi = async (from, to) => {
  const url = `${apiRoutes.getTasks}?from=${from}&to=${to}`;
  const response = await fetch(url);

  if (!response.ok)
    throw new Error("Не вдалося отримати таски");

  return response.json();
};

export const updateTaskReportApi = async ({ taskId, processedArea }) => {
  const formData = new FormData();
  formData.append("processedArea", processedArea);

  const response = await fetch(apiRoutes.updateTaskReport(taskId), {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok)
    throw new Error("Не вдалося оновити площу");

  return await response.json();
};