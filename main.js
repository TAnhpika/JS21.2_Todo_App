// @ts-nocheck
const API_URL = "http://localhost:3000/tasks";

/*
LocaleStorage: chỉ lưu chuỗi / ép chuỗi. có 5mb. lưu dài hạn, k tự xóa
JSON: định dạng dữ liệu (chuỗi) -> chuyển array, object, boolean.. thành chuỗi -> có thể khôi phục ngược lại
- stringify: chuyển JS thành JSON 
- parse: ngc lại
*/

// Lấy danh sách công việc từ localStorage (nếu không có thì khởi tạo mảng rỗng)
let tasks = [];

// Truy cập vào các phần tử trong DOM
const taskList = document.querySelector("#task-list"); // Danh sách công việc
const todoForm = document.querySelector("#todo-form"); // Form thêm công việc
const todoInput = document.querySelector("#todo-input"); // Input để nhập tên công việc

async function fetchTasks() {
    const response = await fetch(API_URL);
    tasks = await response.json();
    renderTasks();
}

async function createTask(task) {
    const response = await fetch(API_URL, {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
    const newTask = await response.json();
    tasks.push(newTask);
    renderTasks();
}

async function updateTask(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const updatedTask = await response.json();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks[taskIndex] = updatedTask;
    renderTasks();
}

async function deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    await response.json();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks.splice(taskIndex, 1)
    renderTasks( )
}
// Hàm để escape HTML nhằm ngăn ngừa XSS
function escapeHTML(html) {
    const div = document.createElement("div");
    div.innerText = html; // Gán nội dung vào thẻ div để tự động escape các ký tự HTML
    return div.innerHTML; // Trả về nội dung đã được escape
}

// Kiểm tra xem tiêu đề công việc mới có bị trùng lặp không
function isDuplicateTask(newTitle, excludeIndex = -1) {
    let isDuplicate = tasks.some(
        (task, index) =>
            task.title.toLowerCase() === newTitle.toLowerCase() && // So sánh không phân biệt chữ hoa/thường
            excludeIndex !== index, // Loại trừ công việc đang chỉnh sửa
    );
    return isDuplicate;
}

// Xử lý các hành động trên công việc (sửa, đánh dấu hoàn thành, xóa)
async function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item"); // Tìm công việc tương ứng với nút được bấm

    // click 'No tasks available' sẽ k bị lỗi nữa
    if (!taskItem) return;

    // Lấy chỉ mục của công việc
    // const taskIndex = +taskItem.getAttribute("data-index");
    const taskId = taskItem.dataset.id; // ngắn gọn hơn khi đặt tên theo format

    const task = tasks.find((task) => task.id === taskId); // Lấy công việc từ danh sách

    // Sửa tiêu đề công việc
    if (e.target.closest(".edit")) {
        const newTitle = prompt("Enter the new task title: ", task.title); // Hỏi người dùng tiêu đề mới

        // khi nhấn cancel prompt sẽ trả về null -> fix null khi cancel
        if (newTitle === null) return; // Hủy nếu người dùng bấm Cancel

        if (!newTitle.trim()) {
            // Xóa khoảng trắng thừa
            return alert("Task title cannot be empty!"); // Cảnh báo nếu tiêu đề rỗng
        }

        if (isDuplicateTask(newTitle, taskId))
            return alert(
                "Task with this title already exist! Please use a different task title!",
            ); // Cảnh báo nếu tiêu đề trùng lặp

        await updateTask(taskId, {
            ...task,
            title: newTitle,
        });

        return;
    }

    // Đánh dấu hoàn thành hoặc chưa hoàn thành
    if (e.target.closest(".done")) {
        await updateTask(taskId, {
            ...task,
            completed: !task.completed,
        });
        return;
    }
    // Xóa công việc
    if (e.target.closest(".delete")) {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            deleteTask(taskId)
        }
    }
}

// Thêm công việc mới
async function addTask(e) {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const value = todoInput.value.trim(); // Lấy giá trị input và xóa khoảng trắng thừa

    if (!value) return alert("Please write sth!"); // Cảnh báo nếu input rỗng

    if (isDuplicateTask(value))
        return alert(
            "Task with this title already exist! Please use a different task title!",
        ); // Cảnh báo nếu tiêu đề trùng lặp

    await createTask({
        title: value,
        completed: false,
    });

    todoInput.value = ""; // xóa input sau nhập
}

// Hiển thị danh sách công việc
function renderTasks() {
    if (!tasks.length) {
        taskList.innerHTML = `<li class="empty-message">No tasks available.</li>`; // Hiển thị thông báo nếu danh sách rỗng
        return;
    }
    const html = tasks
        .map(
            (task) =>
                `<li class="task-item ${
                    task.completed ? "completed" : "" // Thêm class "completed" nếu công việc đã hoàn thành
                }" data-id="${task.id}">
                    <span class="task-title">${escapeHTML(task.title)}</span>
                    <div class="task-action">
                        <button class="task-btn edit">Edit</button>
                        <button class="task-btn done">${task.completed ? "Mark as undone" : "Mark as done"}</button>
                        <button class="task-btn delete">Delete</button>
                    </div>
                </li>`,
        )
        .join(""); // Kết hợp tất cả các phần tử thành một chuỗi HTML

    taskList.innerHTML = html; // Chèn HTML vào danh sách
}
// Lắng nghe sự kiện submit của form
todoForm.addEventListener("submit", addTask);

// Lắng nghe sự kiện click trên danh sách công việc
taskList.addEventListener("click", handleTaskActions);

// Hiển thị danh sách công việc khi tải trang
// renderTasks();
fetchTasks();
