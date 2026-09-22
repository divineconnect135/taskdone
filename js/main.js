"use strict";

// IMPORT TASK FUNCTIONS
import {
  getTasks,
  findTask,
  addTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
} from "./tasks.js";

// IMPORT UI
import { renderTasks } from "./ui.js";

// IMPORT DRAG AND DROP
import { initializeDragDrop } from "./dragDrop.js";

// DOM ELEMENTS
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

// APPLICATION STATE
let editingTaskId = null;

// RENDER APPLICATION
function render() {
  const filters = {
    search: searchInput.value,

    priority: priorityFilter.value,

    date: dateFilter.value,
  };

  renderTasks(getTasks(), filters);
}

// CLEAR FORM ERRORS
function clearFormError() {
  taskFormError.textContent = "";

  taskFormError.classList.add("hidden");
}

// OPEN ADD TASK DIALOG
addTaskButton.addEventListener("click", () => {
  editingTaskId = null;

  taskForm.reset();

  clearFormError();

  taskDialog.querySelector("h2").textContent = "Create New Task";

  taskForm.querySelector('button[type="submit"]').textContent = "Create Task";

  taskDialog.showModal();
});

// CANCEL BUTTON
cancelTaskButton.addEventListener("click", () => {
  taskDialog.close();
});

// FORM SUBMISSION
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(taskForm);

  // Read form values
  const taskData = {
    title: String(formData.get("title") ?? "").trim(),

    description: String(formData.get("description") ?? "").trim(),

    priority: String(formData.get("priority") ?? ""),

    dueDate: String(formData.get("dueDate") ?? ""),
  };

  // Validate
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

  // Update UI
  render();

  // Close dialog
  taskDialog.close();
});

// CLEAR ERRORS WHEN USER TYPES
taskForm.addEventListener("input", clearFormError);

taskForm.addEventListener("change", clearFormError);

// RESET DIALOG WHEN CLOSED
taskDialog.addEventListener("close", () => {
  editingTaskId = null;

  taskForm.reset();

  clearFormError();
});

// EDIT AND DELETE BUTTONS
kanbanBoard.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button || !kanbanBoard.contains(button)) {
    return;
  }

  const taskId = button.dataset.id;

  const action = button.dataset.action;

  // DELETE TASK
  if (action === "delete") {
    const task = findTask(taskId);

    if (!task) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) return;

    deleteTask(taskId);

    render();
  }

  // EDIT TASK
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

// SEARCH
searchInput.addEventListener("input", render);

// PRIORITY FILTER
priorityFilter.addEventListener("change", render);

// DATE FILTER
dateFilter.addEventListener("change", render);

// CLEAR FILTERS
clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";

  priorityFilter.value = "all";

  dateFilter.value = "";

  render();
});

// INITIALIZE DRAG AND DROP
initializeDragDrop(kanbanBoard, changeTaskStatus, render);

// INITIALIZE APPLICATION
render();
