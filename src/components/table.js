import { getTasksFromLocalStorage, setTasksToLocalStorage } from '../utils/localstorage.js';
import {  postToApi, deleteFromApi, updatetoApi } from '../services/tasks.js';
const tbody = document.querySelector("#tasks tbody");
const taskInput = document.querySelector(".task-input");
const taskCountSpan = document.getElementById("task-count");
let totalTaskCount = 0;

export const updateTaskCount = () => {
    taskCountSpan.textContent = totalTaskCount;
  };
  
 export function getRandomUserId() {
    return Math.floor(Math.random() * 50);
  }
  
const editButton = `<i class='bx bxs-edit'></i>`
const saveButton = `<button class="btn save">Save</button>`
export const addRow = (id, todo, status, userId) => {
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
        ${saveButton}
        ${editButton}
      </div>
    </td>
  `;
  return newRow;
};

export const addTasksToTable = (tasks) => {
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
  

export async function addTask() {
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

export function toggleEdit(editIcon) {
    const row = editIcon.closest("tr");
    const todoCell = row.querySelector("td:nth-child(2)");

    if (todoCell) {
        const todoText = todoCell.textContent;
        todoCell.innerHTML = '';
        const editInput = document.createElement("input");
        editInput.value = todoText;
        todoCell.appendChild(editInput);
        editIcon.style.display = "none";
        const saveButton = row.querySelector(".save");
        saveButton.style.display = "inline-block";
    }
}

export function saveEditedTask(saveButton) {
    const row = saveButton.closest("tr");
    const todoCell = row.querySelector("td:nth-child(2)");
    const editInput = todoCell.querySelector("input");
    const idCell = row.querySelector("td:first-child");
    const id = idCell.textContent;
    const allTasks = getTasksFromLocalStorage();
    const taskIndex = allTasks.findIndex(task => task.id === parseInt(id));

    const newTodo = editInput.value;

    if (newTodo === "") {
        alert("Please enter a new task");
        return;
    }
    todoCell.textContent = newTodo;

    if (id && taskIndex !== -1) {
        allTasks[taskIndex].completed = false;
        allTasks[taskIndex].todo = newTodo;
        idCell.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML =
            "Pending";
        updatetoApi(id);
        setTasksToLocalStorage(allTasks);
        const editButton = row.querySelector(".bxs-edit");
        saveButton.style.display = "none";
        editButton.style.display = "inline-block";
    }


}


export function markTaskAsDone(doneButton) {
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

export function deleteTask(deleteButton) {
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
            deleteFromApi(id);
            setTasksToLocalStorage(allTasks);

        }
    }
}

export const filterTasks = (text) => {
    const allTasks = getTasksFromLocalStorage();
    const filterdTasks = allTasks.filter((task) =>
        task.todo.toLowerCase().includes(text.toLowerCase())
    );
    clearTable();
    addTasksToTable(filterdTasks);
};

export const clearTable = () => {
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    totalTaskCount = 0;
    updateTaskCount();
};



export function handleTaskEvents(e) {
    if (e.target.classList.contains("done")) {
      markTaskAsDone(e.target);
    } else if (e.target.classList.contains("delete")) {
      deleteTask(e.target);
    } else if (e.target.classList.contains("bxs-edit")) {
      toggleEdit(e.target);
    } else if (e.target.classList.contains("save")) {
      saveEditedTask(e.target);
    }
  }
  