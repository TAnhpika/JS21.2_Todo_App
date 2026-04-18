const tasks = JSON.parse(localStorage.getItem("myTasks")) ?? [
    {
        title: "123",
        completed: false,
    },
];

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

function addTask(e) {
    e.preventDefault();
    const value = todoInput.value.trim();

    if (!value) return alert("Please write sth!");

    if (isDuplicateTask(value)) {
        return alert("Task already exist!");
    }

    tasks.push({
        title: value,
        completed: false,
    });

    saveAndRender();

    todoInput.value = "";
}

function isDuplicateTask(newTitle, excludeIndex = -1) {
    let isDuplicate = tasks.some(
        (task, index) =>
            task.title.toLowerCase() === newTitle.toLowerCase() &&
            excludeIndex !== index,
    );
    return isDuplicate;
}

function renderTasks() {
    if (!tasks.length) {
        taskList.innerHTML = `<li class="empty-message">No tasks available. </li>`;
        return;
    }

    const html = tasks
        .map(
            (task, index) =>
                `<li class="task-item ${task.completed ? "completed" : ""}" data-index="${index}">
                    <span class="task-title">${escapeHTML(task.title)}</span>
                    <div class="task-action">
                        <button class="task-btn edit">Edit</button>
                        <button class="task-btn done">${task.completed ? "Mark as undone" : "Mark as done"}</button>
                        <button class="task-btn delete">Delete</button>
                    </div>
                </li>`,
        )
        .join("");

    taskList.innerHTML = html;
}

function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item");

    if (!taskItem) return;

    const taskIndex = +taskItem.dataset.index;
    const task = tasks[taskIndex];

    if (e.target.closest(".edit")) {
        const newTitle = prompt("Enter new title: ", task.title);
        if (newTitle === null) return;
        if (!newTitle.trim()) {
            return alert("Task title cannot be empty!");
        }

        if (isDuplicateTask(newTitle, taskIndex))
            return alert("Title existed!");
        task.title = newTitle;
        saveAndRender();
        return;
    }

    if (e.target.closest(".done")) {
        task.completed = !task.completed;
        saveAndRender();
        return;
    }

    if (e.target.closest(".delete")) {
        if (confirm(`Delete ${task.title}?`)) {
            tasks.splice(taskIndex, 1);
            saveAndRender();
        }
    }
}

function saveAndRender() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
    renderTasks();
}

function escapeHTML(html) {
    const div = document.createElement("div");
    div.innerText = html;
    return div.innerHTML;
}

todoForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskActions);
renderTasks();
