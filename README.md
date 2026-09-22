# TaskDone — Kanban Project Management Board

TaskDone is a responsive, browser-based Kanban board built with **HTML5, Tailwind CSS, and vanilla JavaScript (ES Modules)**.

It allows users to create, organize, and manage tasks across three workflow stages: **To Do, In Progress, and Done**.

The project demonstrates core JavaScript fundamentals without relying on frontend frameworks such as React or Vue.

## Features

- Create, edit, and delete tasks.
- Organize tasks into To Do, In Progress, and Done columns.
- Move tasks using the HTML Drag and Drop API.
- Change task status using an accessible dropdown.
- Assign priorities and due dates.
- Search tasks by title and description.
- Filter tasks by priority and due date.
- View dynamic task statistics.
- Persist tasks using LocalStorage.
- Responsive design using Tailwind CSS.
- Form validation and empty states.

## Tech Stack

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES6+)
- JavaScript ES Modules
- HTML Drag and Drop API
- Web Storage API (LocalStorage)

## Project Structure

    TASKDONE/
    │
    ├── index.html
    │
    ├── js/
    │   ├── main.js
    │   ├── tasks.js
    │   ├── storage.js
    │   ├── ui.js
    │   └── dragDrop.js
    │
    └── README.md

### File Responsibilities

| File        | Responsibility                        |
| ----------- | ------------------------------------- |
| index.html  | Application structure and layout      |
| main.js     | Application initialization and events |
| tasks.js    | CRUD operations and task state        |
| storage.js  | LocalStorage management               |
| ui.js       | DOM manipulation and rendering        |
| dragDrop.js | Drag-and-drop functionality           |

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Open the project

Open the project folder in Visual Studio Code.

### 3. Run the application

Install the Live Server extension in VS Code.

Right-click `index.html` and select **Open with Live Server**.

The application will open in your browser.

Note: JavaScript ES Modules require a local HTTP server. Do not open index.html directly using a file:// URL.

## JavaScript Concepts Demonstrated

This project demonstrates practical knowledge of:

- JavaScript objects and arrays
- DOM manipulation
- Event listeners and event delegation
- Array methods: map, filter, find, and forEach
- JavaScript ES Modules
- Import and export statements
- Form handling and validation
- Browser LocalStorage
- JSON.stringify() and JSON.parse()
- HTML Drag and Drop API
- Conditional rendering
- Application state management
- Reusable functions
- Separation of concerns

## Data Persistence

TaskDone uses browser LocalStorage to persist user tasks.

Tasks remain available after refreshing or reopening the application in the same browser.

Data is stored using the key:

`taskflow-tasks`

Note: LocalStorage does not provide cross-device synchronization or cloud storage.

## Future Improvements

- Dark mode
- Task sorting
- Task categories and labels
- Due-date notifications
- Import and export functionality
- Automated JavaScript testing
- Backend and database integration

## Deployment

The project can be deployed using GitHub Pages, Vercel, or another static hosting platform.

The development version uses Tailwind's browser CDN. A compiled Tailwind CSS build should be configured before production deployment.

**Live Demo:** Add your deployed website URL here.

**GitHub Repository:** Add your repository URL here.

## Author

Love Preet Singh

Frontend Developer | React | TypeScript | JavaScript
