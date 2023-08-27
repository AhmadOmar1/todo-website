const tbody = document.querySelector("#tasks tbody");
const taskInput = document.querySelector(".task-input");
const taskForm = document.getElementById("task-form");
const taskCountSpan = document.getElementById("task-count");
const searchInput = document.querySelector(".search-input");

const apiUrl = "https://dummyjson.com/todo";
let lastRowId = 0;
let totalTaskCount = 0;

const addRow = (id, todo, status, userId) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${id}</td>
    <td>${todo}</td>
    <td>${status}</td>
    <td>${userId}</td>
    <td>
     <div class="buttons-list"> 
        <button class="btn delete">Delete</button>
        <button class="btn done">Done</button>
        <i class='bx bxs-edit'></i>
      </div>
    </td>
  `;
  return newRow;
};

console.log(localStorage);
const addTasksToTable = (tasks) => {
  let randId = 1;

  tasks.forEach((task) => {
    let status = "Pending";
    if (task.completed) {
      status = "<del>Completed</del>";
    }

    const newRow = addRow(randId++, task.todo, task.userId, status);
    tbody.appendChild(newRow);
    totalTaskCount += 1;
    updateTaskCount();
  });
};
async function getTasks() {
  try {
    const response = await fetch(`${apiUrl}?limit=20`);
    if (!response.ok) {
      throw new Error(`Response status is not ok`);
    }
    const data = await response.json();
    const fetchedTasks = data.todos;
   
    let storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (!storedTasks) {
      const response = await fetch(`${apiUrl}?limit=20`);
      if (!response.ok) {
        throw new Error(`Response status is not ok`);
      }
      const data = await response.json();
      storedTasks = data.todos;

      localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

   
    addTasksToTable(storedTasks);
    return fetchedTasks; 
  } catch (error) {
    console.log(`Error fetching the data: ${error}`);
  }
}

getTasks();

const updateTaskCount = () => {
  taskCountSpan.textContent = totalTaskCount;
};

function getRandomUserId() {
  return Math.floor(Math.random() * 50);
}


function setTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
}

async function addTask() {
  const todo = taskInput.value;
  if (todo === "") {
    return;
  }

  const newId = totalTaskCount + 1;

  const taskData = {
    userId: getRandomUserId(),
    id: newId,
    todo: todo,
    completed: false,
  };

  const storedTasks = getTasksFromLocalStorage();

  storedTasks.push(taskData);
  // localStorage.clear();
  setTasksToLocalStorage(storedTasks);

  const newRow = addRow(newId, todo, taskData.userId, "Pending");
  tbody.appendChild(newRow);

  totalTaskCount += 1;
  updateTaskCount();
  taskInput.value = "";

  postToApi(taskData);
}


async function postToApi(taskData) {
  try {
    const response = await fetch(`${apiUrl}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }

    const responseData = await response.json();
    console.log("Task added successfully:", responseData);
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

async function updatetoApi(id) {
  fetch(`https://dummyjson.com/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      completed: true,
    }),
  })
    .then((res) => res.json())
    .then(console.log);
}


function handleTaskEvents(e){
  if(e.target.classList.contains("done")){
     markTaskAsDone(e.target);
  } else if (e.target.classList.contains("delete")){
    deleteTask(e.target);
  }
}



function markTaskAsDone(doneButton) {
  const row = doneButton.closest("tr");
  const idCell = row.querySelector("td:first-child");
  const id = idCell.textContent;
  const allTasks = getTasksFromLocalStorage();
  const taskIndex = allTasks.findIndex(task => task.id === parseInt(id));

  if (id && taskIndex !== -1) {
    allTasks[taskIndex].completed = true;
    idCell.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML =
      "<del>Completed</del>";
      updatetoApi(id);
      setTasksToLocalStorage(allTasks);

  }
}

function deleteTask(deleteButton) {
  const row = deleteButton.closest("tr");
  const idCell = row.querySelector("td:first-child");
  const id = idCell.textContent;
  const allTasks = getTasksFromLocalStorage();

  if (id && confirm("Are you sure you want to delete this task?")) {
    const taskIndex = allTasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex !== -1) {
      allTasks.splice(taskIndex, 1);
      row.remove();
      totalTaskCount -= 1;
      updateTaskCount();
      setTasksToLocalStorage(allTasks);

    }
  }
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

tbody.addEventListener("click", (e) => {
  handleTaskEvents(e);
});


const filterTasks = (text) => {
  const allTasks = getTasksFromLocalStorage();
  const filterdTasks = allTasks.filter((task) =>
    task.todo.toLowerCase().includes(text.toLowerCase())
  );
  clearTable();
  addTasksToTable(filterdTasks);
};

const clearTable = () => {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  totalTaskCount = 0;
  updateTaskCount();
};
const debounce = (func, delay) => {
  let debounceTimer
  return function() {
      const context = this
      const args = arguments
          clearTimeout(debounceTimer)
              debounceTimer
          = setTimeout(() => func.apply(context, args), delay)
  }
}
searchInput.addEventListener("input", debounce(

 () => {
  let text = searchInput.value.trim();
  console.log(text);
  if (text === "") {
    clearTable();
    let tasks = getTasksFromLocalStorage();
    addTasksToTable(tasks);
  } else {
    filterTasks(text);
  }
},600

));
