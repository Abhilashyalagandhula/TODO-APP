const inputBtn = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
let count = 0;
const output = document.querySelector(".todo-output");

/////////add todo item////////
const addTodo = (e) => {
  if (inputBtn.value.length === 0) {
    alert("Enter a Task");
  }
  e.preventDefault();
  const todo = inputBtn.value;
  if (todo) {
    const id = Date.now();
    addTodoLocalStorage({ id, todo, completed: false });
    const todoItem = document.createElement("div");
    todoItem.className = `todo-item ${id}`;
    todoItem.innerHTML = `
    <input type="checkbox" class="todo-check">
    <input type="text" class="todo-text" value="${todo}" disabled>
    <button class="edit-btn">Edit</button>
    <button class="del-btn">Delete</button>
    `;
    output.appendChild(todoItem);
    inputBtn.value = "";

    count++;
    updateTaskCount();
  }
};

const addTodoLocalStorage = function (todo) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    tasks = [];
  }
  tasks.push(todo);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasks = () => {
  let tasks = localStorage.getItem("tasks");
  if (tasks) {
    tasks = JSON.parse(tasks);
    tasks.forEach((task) => {
      const todoItem = document.createElement("div");
      todoItem.className = `todo-item ${task.id}`;
      todoItem.innerHTML = `
        <input type="checkbox" class="todo-check">
        <input type="text" class="todo-text${
          task.completed ? " strike" : ""
        }" value="${task.todo}" disabled>
        <button class="edit-btn">Edit</button>
        <button class="del-btn">Delete</button>
        `;
      output.appendChild(todoItem);
    });
    count = tasks.length;
  }
};

const deleteTodo = (e) => {
  if (e.target.classList.contains("del-btn")) {
    deleteTodoFromLocalStorage(e.target.parentElement.classList[1]);

    e.target.parentElement.remove();
    count--;
    updateTaskCount();
  }
};

const deleteTodoFromLocalStorage = (id) => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const toggleTodo = (e) => {
  if (e.target.classList.contains("todo-check")) {
    const todoText = e.target.nextElementSibling;
    todoText.classList.toggle("strike");

    const id = e.target.parentElement.classList[1];
    toggleTodoInLocalStorage(id);
  }
};

const toggleTodoInLocalStorage = (id) => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  const index = tasks.findIndex((task) => task.id === parseInt(id));
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const editTodo = (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.parentElement.classList[1];
    const todoText = e.target.parentElement.querySelector(".todo-text");
    if (todoText.disabled) {
      todoText.disabled = false;
      e.target.textContent = "Save";
    } else {
      todoText.disabled = true;
      e.target.textContent = "Edit";
      editTodoInLocalStorage(id, todoText.value);
    }
  }
};

const editTodoInLocalStorage = (id, newTodo) => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  const index = tasks.findIndex((task) => task.id === parseInt(id));
  tasks[index].todo = newTodo;
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateTaskCount = () => {
  const taskCount = document.querySelector(".task-count");
  taskCount.textContent = `Total tasks: ${count}`;
};

todoForm.addEventListener("submit", addTodo);
output.addEventListener("click", deleteTodo);
output.addEventListener("click", toggleTodo);
output.addEventListener("click", editTodo);

loadTasks();
updateTaskCount();
