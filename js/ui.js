"use strict";

// Create an individual task card
export function createTaskCard(task) {
  const card = document.createElement("article");

  card.className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";

  card.draggable = true;

  card.dataset.taskId = String(task.id);

  // Priority badge
  const badge = document.createElement("span");

  const priorityStyles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-green-100 text-green-700",
  };

  badge.className = `rounded-full px-3 py-1 text-xs font-medium ${
    priorityStyles[task.priority] ?? ""
  }`;

  badge.textContent = `${task.priority} Priority`;

  // Title
  const title = document.createElement("h4");

  title.className = "mt-4 font-semibold";

  title.textContent = task.title;

  // Description
  const description = document.createElement("p");

  description.className = "mt-2 text-sm text-slate-500";

  description.textContent = task.description;

  // Due date
  const dueDate = document.createElement("p");

  dueDate.className =
    "mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500";

  dueDate.textContent = `Due: ${task.dueDate}`;

  // Action container
  const actions = document.createElement("div");

  actions.className = "mt-4 flex justify-end gap-3";

  // Edit button
  const editButton = document.createElement("button");

  editButton.type = "button";

  editButton.textContent = "Edit";

  editButton.className =
    "rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100";

  editButton.dataset.action = "edit";

  editButton.dataset.id = String(task.id);

  // Delete button
  const deleteButton = document.createElement("button");

  deleteButton.type = "button";

  deleteButton.textContent = "Delete";

  deleteButton.className =
    "rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100";

  deleteButton.dataset.action = "delete";

  deleteButton.dataset.id = String(task.id);

  actions.append(editButton, deleteButton);

  // Status dropdown
  const statusSelect = document.createElement("select");

  statusSelect.className =
    "mt-4 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm";

  statusSelect.dataset.action = "move";

  statusSelect.dataset.id = String(task.id);

  statusSelect.setAttribute("aria-label", `Change status of ${task.title}`);

  const statuses = [
    {
      value: "todo",
      label: "To Do",
    },
    {
      value: "progress",
      label: "In Progress",
    },
    {
      value: "done",
      label: "Done",
    },
  ];

  statuses.forEach((status) => {
    const option = document.createElement("option");

    option.value = status.value;

    option.textContent = status.label;

    statusSelect.append(option);
  });

  statusSelect.value = task.status;

  // Assemble card
  card.append(badge, title, description, dueDate, actions, statusSelect);

  return card;
}

// Filter tasks
export function getFilteredTasks(tasks, filters) {
  const searchTerm = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm);

    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    const matchesDate = !filters.date || task.dueDate <= filters.date;

    return matchesSearch && matchesPriority && matchesDate;
  });
}

// Update statistics
export function updateStatistics(tasks) {
  document.querySelector("#stat-total").textContent = tasks.length;

  const statuses = ["todo", "progress", "done"];

  statuses.forEach((status) => {
    const count = tasks.filter((task) => task.status === status).length;

    document.querySelector(`#stat-${status}`).textContent = count;
  });
}

// Render the Kanban board
export function renderTasks(tasks, filters) {
  const columns = {
    todo: document.querySelector("#todo-tasks"),

    progress: document.querySelector("#progress-tasks"),

    done: document.querySelector("#done-tasks"),
  };

  // Clear existing cards
  Object.values(columns).forEach((container) => {
    container.replaceChildren();
  });

  // Get filtered tasks
  const filteredTasks = getFilteredTasks(tasks, filters);

  // Display task cards
  filteredTasks.forEach((task) => {
    const container = columns[task.status];

    if (container) {
      const card = createTaskCard(task);

      container.append(card);
    }
  });

  // Empty states
  Object.values(columns).forEach((container) => {
    if (container.children.length === 0) {
      const message = document.createElement("p");

      message.className =
        "rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500";

      message.textContent =
        tasks.length === 0
          ? "No tasks yet. Create your first task!"
          : "No matching tasks";

      container.append(message);
    }
  });

  // Update statistics
  updateStatistics(tasks);

  // Update filter count
  document.querySelector("#filter-count").textContent =
    `Showing ${filteredTasks.length} of ${tasks.length} tasks`;
}
