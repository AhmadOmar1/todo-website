const addBtn = document.querySelector(".btn.add");
const tbody = document.querySelector("#tasks tbody");
const taskInput = document.querySelector(".task-input");
const taskForm = document.getElementById("task-form");
const taskCountSpan = document.getElementById("task-count");



let lastRowId = 0;
let totalTaskCount = 0; 

const addRow = (id, todo,userId,status) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${id}</td>
    <td>${todo}</td>
    <td>${userId}</td>
    <td>${status}</td>
    <td>
      <button class="btn delete">Delete</button>
      <button class="btn done">Done</button>
    </td>
  `;
  return newRow;
};


async function getTasks(){
  try{
    const response = await fetch("https://dummyjson.com/todos");
    if(!response.ok) {
      throw new Error(`response status is not ok`);
    }
    const data = await response.json();

      data.todos.forEach((task) => {
       let status = 'Pending';
       if(task.completed){
        status = 'Completed';
       }
       const newRow = addRow(task.id, task.todo, task.userId, status);
       tbody.appendChild(newRow);
       totalTaskCount+=1;
       updateTaskCount();

    })
  } catch(error){
    console.log(`Error fetching the data: ${error}`);
  }
};

getTasks();


const updateTaskCount = () => {
  taskCountSpan.textContent = totalTaskCount;
};


// add a new task 

function getRandomUserId() {
    return Math.floor(Math.random() * 50);
  }
  
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todo = taskInput.value;
    if (todo === "") {
      return;
    }
    const newId = totalTaskCount + 1;
    const newRow = addRow(newId, todo,getRandomUserId(), "Pending");
    tbody.appendChild(newRow);
    totalTaskCount += 1;
    updateTaskCount();
    taskInput.value = "";
  });