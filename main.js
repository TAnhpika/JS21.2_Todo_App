// const title = prompt("Nhap cong viec moi", "Cong viec 1")
// console.log(title);

const tasks = [
    {
        title: "Nau com",
        completed: false,
    },
    {
        title: "Quet nha",
        completed: false,
    },
    {
        title: "Rua bat",
        completed: false,
    },
];

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

taskList.onclick = function (e) {
    const taskItem = e.target.closest(".task-item");
    const taskIndex = +taskItem.getAttribute("task-index");
    const task = tasks[taskIndex];

    if (e.target.closest(".edit")) {
        const newTitle = prompt("Enter the new task title: ", task.title);
        task.title = newTitle;
        render();
    } else if (e.target.closest(".done")) {
        console.log("Mark as done/undone");
    } else if (e.target.closest(".delete")) {
        console.log("Delete");
    }
};

todoForm.onsubmit = function (e) {
    e.preventDefault();
    const value = todoInput.value.trim();

    if (!value) {
        return alert("Please write sth!");
    }

    const newTask = {
        title: value,
        completed: false,
    };
    tasks.push(newTask);

    // re-render
    render();

    todoInput.value = ""; // xóa input sau nhập
};

function render() {
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

render(); //hiện task có sẵn
