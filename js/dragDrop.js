"use strict";

export function initializeDragDrop(kanbanBoard, changeTaskStatus, render) {
  // DRAG START
  kanbanBoard.addEventListener("dragstart", (event) => {
    const card = event.target.closest("article[data-task-id]");

    if (!card) return;

    event.dataTransfer.setData("text/plain", card.dataset.taskId);

    event.dataTransfer.effectAllowed = "move";

    card.classList.add("opacity-50");
  });

  // DRAG OVER
  kanbanBoard.addEventListener("dragover", (event) => {
    const column = event.target.closest("[data-status]");

    if (!column) return;

    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
  });

  // DROP
  kanbanBoard.addEventListener("drop", (event) => {
    const column = event.target.closest("[data-status]");

    if (!column) return;

    event.preventDefault();

    const taskId = event.dataTransfer.getData("text/plain");

    if (!taskId) return;

    const newStatus = column.dataset.status;

    const updated = changeTaskStatus(taskId, newStatus);

    if (updated) {
      render();
    }
  });

  // DRAG END
  kanbanBoard.addEventListener("dragend", (event) => {
    const card = event.target.closest("article[data-task-id]");

    if (!card) return;

    card.classList.remove("opacity-50");
  });

  // STATUS DROPDOWN
  kanbanBoard.addEventListener("change", (event) => {
    const select = event.target.closest('select[data-action="move"]');

    if (!select) return;

    const taskId = select.dataset.id;

    const newStatus = select.value;

    const updated = changeTaskStatus(taskId, newStatus);

    if (updated) {
      render();
    }
  });
}
