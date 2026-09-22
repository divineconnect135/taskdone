"use strict";

import { loadTasks, saveTasks } from "./storage.js";

// Default tasks
const defaultTasks = [
  {
    id: 1,
    title: "Build Dashboard UI",
    description: "Create the dashboard layout",
    status: "todo",
    priority: "High",
    dueDate: "2026-10-15",
  },
  {
    id: 2,
    title: "Implement JavaScript",
    description: "Add dynamic task rendering",
    status: "progress",
    priority: "Medium",
    dueDate: "2026-10-18",
  },
  {
    id: 3,
    title: "Project Setup",
    description: "Initialize project files",
    status: "done",
    priority: "Low",
    dueDate: "2026-10-12",
  },
];

// Application state
let tasks = loadTasks(defaultTasks);

// Get all tasks
export function getTasks() {
  return tasks;
}

// Find task
export function findTask(taskId) {
  return tasks.find((task) => String(task.id) === String(taskId));
}

// Create task
export function addTask(taskData) {
  const newTask = {
    id: crypto.randomUUID(),

    ...taskData,

    status: "todo",
  };

  tasks.unshift(newTask);

  saveTasks(tasks);

  return newTask;
}

// Update task
export function updateTask(taskId, updatedData) {
  const task = findTask(taskId);

  if (!task) {
    return false;
  }

  task.title = updatedData.title;

  task.description = updatedData.description;

  task.priority = updatedData.priority;

  task.dueDate = updatedData.dueDate;

  saveTasks(tasks);

  return true;
}

// Delete task
export function deleteTask(taskId) {
  const task = findTask(taskId);

  if (!task) {
    return false;
  }

  tasks = tasks.filter((task) => String(task.id) !== String(taskId));

  saveTasks(tasks);

  return true;
}

// Change task status
export function changeTaskStatus(taskId, newStatus) {
  const validStatuses = ["todo", "progress", "done"];

  if (!validStatuses.includes(newStatus)) {
    return false;
  }

  const task = findTask(taskId);

  if (!task) {
    return false;
  }

  if (task.status === newStatus) {
    return false;
  }

  task.status = newStatus;

  saveTasks(tasks);

  return true;
}
