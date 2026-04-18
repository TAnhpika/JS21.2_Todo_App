// Task: TÌm hiểu JSON & LocaleStorage -> lưu task

/*
LocaleStorage: chỉ lưu chuỗi / ép chuỗi. có 5mb. lưu dài hạn, k tự xóa
JSON: định dạng dữ liệu (chuỗi) -> chuyển array, object, boolean.. thành chuỗi -> có thể khôi phục ngược lại
- stringify: chuyển JS thành JSON 
- parse: ngc lạ
*/

// Lấy dữ liệu cũ hoặc tạo mảng rỗng nếu chưa có gì
const tasks = JSON.parse(localStorage.getItem("myTasks")) ?? [];

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

function isDuplicateTask(newTitle, excludeIndex = -1) {
    let isDuplicate = tasks.some(
        (task, index) =>
            task.title.toLowerCase() === newTitle.toLowerCase() &&
            // k check trùng task có index hiện tại - khi edit nhưng k edit thì vẫn đc
            index !== excludeIndex, // -1 lun đúng vì mảng index dương
    );
    return isDuplicate;
}

function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item");
    const taskIndex = +taskItem.getAttribute("task-index");
    const task = tasks[taskIndex];

    if (e.target.closest(".edit")) {
        const newTitle = prompt("Enter the new task title: ", task.title);

        // khi nhấn cancel prompt sẽ trả về null -> fix null khi cancel
        if (newTitle === null) return;

        if (!newTitle.trim()) {
            return alert("Task title cannot be empty!");
        }

        if (isDuplicateTask(newTitle, taskIndex))
            return alert(
                "Task with this title already exist! Please use a different task title!",
            );

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
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            tasks.splice(taskIndex, 1);
            saveAndRender();
        }
    }
}

function addTask(e) {
    e.preventDefault();
    const value = todoInput.value.trim();

    if (!value) return alert("Please write sth!");

    if (isDuplicateTask(value))
        return alert(
            "Task with this title already exist! Please use a different task title!",
        );

    tasks.push({
        title: value,
        completed: false,
    });

    saveAndRender();

    todoInput.value = ""; // xóa input sau nhập
}

function renderTasks() {
    if (!tasks.length) {
        taskList.innerHTML = `<li class="empty-message">No tasks available</li>`;
        return;
    }
    const html = tasks
        .map(
            (task, index) =>
                `<li class="task-item ${task.completed ? "completed" : ""}" task-index="${index}">
                    <span class="task-title">${task.title}</span>
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

function saveAndRender() {
    // Lưu mảng mới vào LocalStorage (phải stringify)
    localStorage.setItem("myTasks", JSON.stringify(tasks));

    // Render lại giao diện
    renderTasks();
}

todoForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskActions);

renderTasks(); //hiện task có sẵn
