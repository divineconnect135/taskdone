"use strict";

// =========================
// IMPORTS
// =========================

import {
  getTasks,
  findTask,
  addTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
} from "./tasks.js";

import { renderTasks } from "./ui.js";

import { initializeDragDrop } from "./dragDrop.js";

// =========================
// DOM ELEMENTS
// =========================

const addTaskButton = document.querySelector("#add-task-btn");

const taskDialog = document.querySelector("#task-dialog");

const taskForm = document.querySelector("#task-form");

const cancelTaskButton = document.querySelector("#cancel-task-btn");

const taskFormError = document.querySelector("#task-form-error");

const kanbanBoard = document.querySelector("#kanban-board");

const searchInput = document.querySelector("#search-input");

const priorityFilter = document.querySelector("#priority-filter");

const dateFilter = document.querySelector("#date-filter");

const clearFiltersButton = document.querySelector("#clear-filters-btn");

// =========================
// APPLICATION STATE
// =========================

let editingTaskId = null;

// =========================
// RENDER APPLICATION
// =========================

function render() {
  const filters = {
    search: searchInput.value,

    priority: priorityFilter.value,

    date: dateFilter.value,
  };

  renderTasks(getTasks(), filters);
}

// =========================
// FORM ERROR HELPERS
// =========================

function clearFormError() {
  taskFormError.textContent = "";

  taskFormError.classList.add("hidden");
}

// =========================
// GOOGLE CALENDAR
// =========================

function getGoogleCalendarDates(dueDate) {
  const [year, month, day] = dueDate.split("-").map(Number);

  const startDate = new Date(Date.UTC(year, month - 1, day));

  const endDate = new Date(startDate);

  // Google Calendar all-day events
  // use an exclusive end date,
  // so a one-day task ends the next day.
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  function formatDate(date) {
    return date.toISOString().slice(0, 10).replaceAll("-", "");
  }

  return {
    start: formatDate(startDate),

    end: formatDate(endDate),
  };
}

function addTaskToGoogleCalendar(task) {
  if (!task.dueDate) {
    return;
  }

  const { start, end } = getGoogleCalendarDates(task.dueDate);

  const params = new URLSearchParams({
    action: "TEMPLATE",

    text: task.title,

    dates: `${start}/${end}`,

    details: `${task.description}\n\nPriority: ${task.priority}`,
  });

  const calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;

  window.open(calendarUrl, "_blank", "noopener,noreferrer");
}

// =========================
// OPEN CREATE TASK DIALOG
// =========================

addTaskButton.addEventListener("click", () => {
  editingTaskId = null;

  taskForm.reset();

  clearFormError();

  taskDialog.querySelector("h2").textContent = "Create New Task";

  taskForm.querySelector('button[type="submit"]').textContent = "Create Task";

  taskDialog.showModal();
});

// =========================
// CANCEL
// =========================

cancelTaskButton.addEventListener("click", () => {
  taskDialog.close();
});

// =========================
// FORM SUBMISSION
// =========================

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(taskForm);

  const taskData = {
    title: String(formData.get("title") ?? "").trim(),

    description: String(formData.get("description") ?? "").trim(),

    priority: String(formData.get("priority") ?? ""),

    dueDate: String(formData.get("dueDate") ?? ""),
  };

  // Validation
  if (
    !taskData.title ||
    !taskData.description ||
    !taskData.priority ||
    !taskData.dueDate
  ) {
    taskFormError.textContent = "Please complete all fields.";

    taskFormError.classList.remove("hidden");

    return;
  }

  // EDIT MODE
  if (editingTaskId !== null) {
    const updated = updateTask(editingTaskId, taskData);

    if (!updated) {
      taskFormError.textContent = "Task not found. Please try again.";

      taskFormError.classList.remove("hidden");

      return;
    }
  } else {
    // CREATE MODE
    addTask(taskData);
  }

  render();

  taskDialog.close();
});

// =========================
// CLEAR FORM ERROR
// =========================

taskForm.addEventListener("input", clearFormError);

taskForm.addEventListener("change", clearFormError);

// =========================
// RESET DIALOG
// =========================

taskDialog.addEventListener("close", () => {
  editingTaskId = null;

  taskForm.reset();

  clearFormError();
});

// =========================
// CARD ACTIONS
// =========================

kanbanBoard.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button || !kanbanBoard.contains(button)) {
    return;
  }

  const taskId = button.dataset.id;

  const action = button.dataset.action;

  // =====================
  // GOOGLE CALENDAR
  // =====================

  if (action === "calendar") {
    const task = findTask(taskId);

    if (!task) return;

    addTaskToGoogleCalendar(task);

    return;
  }

  // =====================
  // DELETE TASK
  // =====================

  if (action === "delete") {
    const task = findTask(taskId);

    if (!task) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteTask(taskId);

    render();

    return;
  }

  // =====================
  // EDIT TASK
  // =====================

  if (action === "edit") {
    const task = findTask(taskId);

    if (!task) return;

    editingTaskId = String(task.id);

    clearFormError();

    taskForm.elements.namedItem("title").value = task.title;

    taskForm.elements.namedItem("description").value = task.description;

    taskForm.elements.namedItem("priority").value = task.priority;

    taskForm.elements.namedItem("dueDate").value = task.dueDate;

    taskDialog.querySelector("h2").textContent = "Edit Task";

    taskForm.querySelector('button[type="submit"]').textContent =
      "Save Changes";

    taskDialog.showModal();
  }
});

// =========================
// SEARCH
// =========================

searchInput.addEventListener("input", render);

// =========================
// PRIORITY FILTER
// =========================

priorityFilter.addEventListener("change", render);

// =========================
// DATE FILTER
// =========================

dateFilter.addEventListener("change", render);

// =========================
// CLEAR FILTERS
// =========================

clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";

  priorityFilter.value = "all";

  dateFilter.value = "";

  render();
});

// =========================
// DRAG AND DROP
// =========================

initializeDragDrop(kanbanBoard, changeTaskStatus, render);

// =========================
// INITIALIZE APPLICATION
// =========================

render();

console.log("TaskDone initialized successfully!");
