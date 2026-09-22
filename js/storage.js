"use strict";

const STORAGE_KEY = "taskflow-tasks";

// Load saved tasks
export function loadTasks(defaultTasks) {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (savedTasks === null) {
    return [...defaultTasks];
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (Array.isArray(parsedTasks)) {
      return parsedTasks;
    }
  } catch (error) {
    console.error("Failed to load tasks:", error);
  }

  return [...defaultTasks];
}

// Save tasks
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
