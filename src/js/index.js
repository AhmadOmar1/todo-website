import { getTasksFromLocalStorage, setTasksToLocalStorage } from "../utils/localstorage.js";
import { fetchTasksFromApi} from "../services/tasks.js";
import { debounce } from "../utils/debounce.js";
import { handleTaskEvents , filterTasks , addTasksToTable , clearTable , addTask } from "../components/table.js";
const tbody = document.querySelector("#tasks tbody");
const taskForm = document.getElementById("task-form");
const searchInput = document.querySelector(".search-input");
const apiUrl = "https://dummyjson.com/todo";


async function getTasks(apiUrl) {
  try {
    const fetchedTasks = await fetchTasksFromApi(apiUrl, 20);
    const storedTasks = getTasksFromLocalStorage();

    if (!storedTasks) {
      storedTasks = fetchedTasks;
      setTasksToLocalStorage(storedTasks);
    }
    return storedTasks;
  } catch (error) {
    console.log(`Error fetching the data: ${error}`);
    throw error;
  }
}

getTasks(apiUrl)
  .then((tasks) => {
    addTasksToTable(tasks);
  })
  .catch((error) => {

    console.log(`Error fetching the data: ${error}`);
  });


taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

tbody.addEventListener("click", (e) => {
  handleTaskEvents(e);
});



searchInput.addEventListener("input", debounce(
  () => {
    let text = searchInput.value.trim();
    if (text === "") {
      clearTable();
      let tasks = getTasksFromLocalStorage();
      addTasksToTable(tasks);
    } else {
      filterTasks(text);
    }
  }, 600
));
