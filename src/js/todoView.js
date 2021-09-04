import { dragAndDrop } from "./dragAndDrop.js";
import todoList from "./todo.js";

const input = document.querySelector(".todo__input__field");
const message = document.querySelector(".todo__list__message");
const filterButtons = document.querySelectorAll(".filter-option");
const itemsLeft = document.querySelector(".items-left");
const clearCompleted = document.querySelector(".clear-completed p");
const errorMessage = document.querySelector(".message");
let currentFilter;

// Source: https://learnersbucket.com/examples/javascript/unique-id-generator-in-javascript/
const generateID = function () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

input.addEventListener("keydown", (e) => {
  currentFilter = document.querySelector("input[name='filter']:checked");

  if (e.keyCode !== 13) return;

  // Handle input
  if (input.value === "") {
    console.log("dsadas");
    errorMessage.classList.add("active");
    setTimeout(() => errorMessage.classList.remove("active"), 3000);
  } else {
    // Push new task with ID to allTasks array
    todoList.addTask(generateID(), input.value.trim());

    // Display the new task on the DOM
    const html = todoList.displayTask(todoList.allTasks.slice(-1)[0]);

    // Make sure to display the new task when filter is on all or active only
    if (currentFilter.id !== "completedTasks") {
      if (todoList.allTasks.length === 1) {
        message.style.display = "none";
      }

      todoList.container.insertAdjacentHTML("beforeend", html);
    }
  }

  // Reset input field to default state
  input.value = "";
  input.focus();

  // Update itemsLeft text
  itemsLeft.textContent = todoList.updateItemsLeft();

  // Start drag and drop
  dragAndDrop();

  // Save to localStorage
  todoList.saveToLocalStorage();
});

// Handle delete and check/uncheck completed
todoList.container.addEventListener("click", (e) => {
  currentFilter = document.querySelector("input[name='filter']:checked");
  const target = e.target.closest(".todo__item__icon");

  if (target) {
    const todoItem = target.closest(".todo__item");
    const id = todoItem.dataset.id;
    const input = todoItem.querySelector("input");
    const action = target.dataset.role;

    if (action === "delete") {
      todoList.deleteTask(id);
      todoItem.remove();
    }

    if (action === "check") {
      if (input.checked === false) {
        input.checked = true;
        todoList.updateCompleted(id, "check");
      } else {
        input.checked = false;
        todoList.updateCompleted(id, "uncheck");
      }
    }

    // Update active and completed tasks list on the DOM
    if (currentFilter.id === "activeTasks") {
      todoList.updateTasksList(todoList[currentFilter.id], true);
    }
    if (currentFilter.id === "completedTasks") {
      todoList.updateTasksList(todoList[currentFilter.id], false);
    }

    itemsLeft.textContent = todoList.updateItemsLeft();
    if (todoList.allTasks.length === 0) {
      message.style.display = "block";
    }

    todoList.saveToLocalStorage();
  }

  dragAndDrop();
});

// Handle filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const filter = e.target.getAttribute("for");

    todoList.updateTasksList(todoList[filter], false);

    // Disable drag and drop for completed tasks
    if (filter === "completedTasks") {
      todoList.updateTasksList(todoList[filter], false);
      todoList.container.classList.add("change-cursor");
    }
    if (filter === "allTasks" || filter === "activeTasks") {
      todoList.updateTasksList(todoList[filter], true);
      todoList.container.classList.remove("change-cursor");

      dragAndDrop();
    }
  });
});

// Clear all completed tasks
clearCompleted.addEventListener("click", () => {
  todoList.clearCompletedTasks();
  todoList.updateTasksList(todoList.allTasks);

  todoList.saveToLocalStorage();
});

// Initial state on load
window.addEventListener("load", () => {
  todoList.updateActiveTasks();
  document.querySelector("input[id='allTasks']").checked = true;

  todoList.allTasks.length === 0
    ? (message.style.display = "block")
    : todoList.updateTasksList(todoList.allTasks);

  itemsLeft.textContent = todoList.updateItemsLeft();

  dragAndDrop();
});
