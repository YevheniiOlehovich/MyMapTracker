import apiRoutes from "../helpres/ApiRoutes";

/* =========================================
   GET ALL TASKS
========================================= */

export const fetchTasksApi = async () => {
  const response = await fetch(apiRoutes.getTasks);

  if (!response.ok) {
    throw new Error("Не вдалося отримати таски");
  }

  return await response.json();
};

/* =========================================
   GET TASK BY ID
========================================= */

export const fetchTaskByIdApi = async (taskId) => {
  const response = await fetch(
    apiRoutes.getTaskById(taskId)
  );

  if (!response.ok) {
    throw new Error("Не вдалося отримати таску");
  }

  return await response.json();
};

/* =========================================
   GET TASKS BY DATE
========================================= */

export const fetchTasksByDateApi = async (date) => {
  const url = date
    ? `${apiRoutes.getTasks}?date=${date}`
    : apiRoutes.getTasks;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Не вдалося отримати таски");
  }

  return await response.json();
};

/* =========================================
   GET TASK IDS BY RANGE
========================================= */

export const fetchTasksByRangeApi = async (
  startDate,
  endDate
) => {
  const response = await fetch(
    apiRoutes.getTaskIdsByRange(
      startDate,
      endDate
    )
  );

  if (!response.ok) {
    throw new Error(
      "Не вдалося отримати таски за період"
    );
  }

  return await response.json();
};

/* =========================================
   CREATE TASK
========================================= */

export const saveTaskApi = async (taskData) => {
  const response = await fetch(
    apiRoutes.addTask,
    {
      method: "POST",
      body: taskData,
    }
  );

  if (!response.ok) {
    throw new Error("Не вдалося створити таску");
  }

  return await response.json();
};

/* =========================================
   UPDATE TASK
========================================= */

export const updateTaskApi = async ({
  taskId,
  taskData,
}) => {
  const response = await fetch(
    apiRoutes.updateTask(taskId),
    {
      method: "PUT",
      body: taskData,
    }
  );

  if (!response.ok) {
    throw new Error("Не вдалося оновити таску");
  }

  return await response.json();
};

/* =========================================
   UPDATE TASK REPORT
========================================= */


export const updateTaskReportApi = async ({
  taskId,
  assignments,
}) => {

  const formData = new FormData();

  formData.append(
    "assignments",
    JSON.stringify(assignments)
  );

  const response = await fetch(
    apiRoutes.updateTaskReport(taskId),
    {
      method: "PATCH",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Не вдалося оновити звіт"
    );
  }

  return await response.json();
};

/* =========================================
   DELETE TASK
========================================= */

export const deleteTaskApi = async (taskId) => {
  const response = await fetch(
    apiRoutes.deleteTask(taskId),
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Не вдалося видалити таску");
  }

  return taskId;
};