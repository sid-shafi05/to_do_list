let add=document.querySelector(".add");
let tasks=document.querySelector(".tasks");
let textarea=document.querySelector(".textarea")
let checkbox=document.querySelector(".check")

let tasksArray=[];

function addtask() {
    let text=textarea.value;      
tasksArray.push({ text: text, done: false });
localStorage.setItem("tasks", JSON.stringify(tasksArray))
render();                   
}




function render() {
    tasks.innerHTML = "";
    tasksArray.forEach((task) => {
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox"> <span>${task.text}</span> <button class="remove">x</button>`;
        let remove = li.querySelector(".remove");
 remove.addEventListener("click", () => {
    tasksArray = tasksArray.filter(t => t.text !== task.text);
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    render();
})

        let checkbox = li.querySelector("input");
        let span = li.querySelector("span");
checkbox.checked = task.done;  // restore checkbox state
if (task.done) span.style.textDecoration = "line-through";  // restore strikethrough
        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            localStorage.setItem("tasks", JSON.stringify(tasksArray)); // missing this
            if (checkbox.checked) span.style.textDecoration = "line-through";
            else span.style.textDecoration = "none";
        })

        tasks.appendChild(li);
    })
}
let saved = localStorage.getItem("tasks");
if (saved) {
    tasksArray = JSON.parse(saved);
    render();
}

add.addEventListener("click", () => {
    if (textarea.value.trim() === "") return;
    addtask();
    textarea.value = "";
})