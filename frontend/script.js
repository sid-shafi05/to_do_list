let add = document.querySelector(".add");
let tasks = document.querySelector(".tasks");
let textarea = document.querySelector(".textarea");
let checkbox = document.querySelector(".check");

const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");
const activeBadge = document.getElementById("activeBadge");
const completedBadge = document.getElementById("completedBadge");
const activeTasksList = document.getElementById("activeTasks");
const completedTasksList = document.getElementById("completedTasks");

function updateStats(tasksArray) {
    const total = tasksArray.length;
    const active = tasksArray.filter(t => !t.done).length;
    const completed = tasksArray.filter(t => t.done).length;
    
    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
    activeBadge.textContent = active;
    completedBadge.textContent = completed;
}

async function addtask() {
    let text = textarea.value;
    await fetch("https://to-do-list-uzqy.onrender.com/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, done: false })
    });
    render();
}

function createTaskElement(task) {
    let li = document.createElement("li");
    li.className = task.done ? "completed" : "";
    li.innerHTML = `<input type="checkbox"> <span>${task.text}</span> <button class="remove">x</button>`;
    
    let remove = li.querySelector(".remove");
    remove.addEventListener("click", async () => {
        await fetch(`https://to-do-list-uzqy.onrender.com/tasks/${task._id}`, {
            method: "DELETE",
        });
        await render();
    });

    let checkbox = li.querySelector("input");
    let span = li.querySelector("span");
    checkbox.checked = task.done;
    if (task.done) span.style.textDecoration = "line-through";
    
checkbox.addEventListener("change", async () => {
    task.done = checkbox.checked;
    if (checkbox.checked) span.style.textDecoration = "line-through";
    else span.style.textDecoration = "none";
    
    await fetch(`https://to-do-list-uzqy.onrender.com/tasks/${task._id}`, {
        method: "PATCH",  
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: task.done })
    });
    
    await render();
});

    return li;
}

async function render() {
    const response = await fetch("https://to-do-list-uzqy.onrender.com/tasks");
    const tasksArray = await response.json();

    activeTasksList.innerHTML = "";
    completedTasksList.innerHTML = "";
    
    const activeTasks = tasksArray.filter(t => !t.done);
    const completedTasks = tasksArray.filter(t => t.done);
    
    if (activeTasks.length === 0) {
        activeTasksList.innerHTML = '<div class="empty-msg">No active tasks</div>';
    } else {
        activeTasks.forEach((task) => {
            activeTasksList.appendChild(createTaskElement(task));
        });
    }
    
    if (completedTasks.length === 0) {
        completedTasksList.innerHTML = '<div class="empty-msg">No completed tasks</div>';
    } else {
        completedTasks.forEach((task) => {
            completedTasksList.appendChild(createTaskElement(task));
        });
    }
    
    updateStats(tasksArray);
}

add.addEventListener("click", () => {
    if (textarea.value.trim() === "") return;
    addtask();
    textarea.value = "";
});

render();