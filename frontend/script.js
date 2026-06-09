let add=document.querySelector(".add");
let tasks=document.querySelector(".tasks");
let textarea=document.querySelector(".textarea")
let checkbox=document.querySelector(".check")

async function addtask() {
    let text=textarea.value;      
await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, done: false })
    });
render();                   
}




async function render() {
   const response = await fetch("http://localhost:3000/tasks");
    const tasksArray = await response.json();

    tasks.innerHTML = "";
    tasksArray.forEach((task) => {
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox"> <span>${task.text}</span> <button class="remove">x</button>`;
        let remove = li.querySelector(".remove");
 remove.addEventListener("click",async () => {
    await fetch(`http://localhost:3000/tasks/${task._id}`, {
        method: "DELETE",
    });
    await render();
})

        let checkbox = li.querySelector("input");
        let span = li.querySelector("span");
checkbox.checked = task.done;  // restore checkbox state
if (task.done) span.style.textDecoration = "line-through";  // restore strikethrough
        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            if (checkbox.checked) span.style.textDecoration = "line-through";
            else span.style.textDecoration = "none";
        })

        tasks.appendChild(li);
    })
}


add.addEventListener("click", () => {
    if (textarea.value.trim() === "") return;
    addtask();
    textarea.value = "";
})

render();