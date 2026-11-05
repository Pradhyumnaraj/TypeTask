import { addTask, advanceTask, filterByStatus } from "./model.js";
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");
const filterControls = document.getElementById("filter-controls");
let tasks = [];
let activeFilter = "all";
function isTaskStatus(value) {
    return value === "todo" || value === "in-progress" || value === "done";
}
function renderTasks() {
    const visibleTasks = activeFilter === "all" ? tasks : filterByStatus(tasks, activeFilter);
    taskList.replaceChildren();
    taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
    emptyState.hidden = visibleTasks.length > 0;
    emptyState.textContent =
        tasks.length === 0
            ? "Nothing on your list yet. Add a task to get moving."
            : "No tasks in this view. Try another filter.";
    for (const task of visibleTasks) {
        const item = document.createElement("li");
        item.className = "task";
        const details = document.createElement("div");
        details.className = "task__details";
        const title = document.createElement("span");
        title.className = "task__title";
        title.textContent = task.title;
        const badge = document.createElement("span");
        badge.className = `status status--${task.status}`;
        badge.textContent = task.status === "in-progress" ? "In progress" : task.status;
        details.append(title, badge);
        const advanceButton = document.createElement("button");
        advanceButton.className = "task__advance";
        advanceButton.type = "button";
        advanceButton.textContent = task.status === "done" ? "Done" : "Advance";
        advanceButton.disabled = task.status === "done";
        advanceButton.setAttribute("aria-label", `Advance ${task.title}`);
        advanceButton.addEventListener("click", () => {
            tasks = advanceTask(tasks, task.id);
            renderTasks();
        });
        item.append(details, advanceButton);
        taskList.append(item);
    }
}
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (title.length === 0) {
        titleInput.focus();
        return;
    }
    tasks = addTask(tasks, title);
    titleInput.value = "";
    titleInput.focus();
    renderTasks();
});
filterControls.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
        return;
    }
    const button = target.closest("button[data-status]");
    if (button === null) {
        return;
    }
    const status = button.dataset.status;
    if (status !== "all" && !isTaskStatus(status)) {
        return;
    }
    activeFilter = status;
    for (const filterButton of filterControls.querySelectorAll("button[data-status]")) {
        filterButton.setAttribute("aria-pressed", String(filterButton === button));
    }
    renderTasks();
});
renderTasks();
