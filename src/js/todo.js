export class Task {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.isCompleted = false;
    this.previousIndex = 0;
  }
}

class TodoList {
  constructor() {
    this.allTasks = JSON.parse(window.localStorage.getItem("todoList")) || [];
    this.activeTasks = [];
    this.completedTasks = [];
    this.container = document.querySelector(".todo__list__body");
    this.theme = JSON.parse(window.localStorage.getItem("theme")) || "dark";
  }

  addTask(id, text) {
    this.allTasks.push(new Task(id, text));
  }

  deleteTask(id) {
    const index = this.allTasks.findIndex((task) => task.id === id);

    this.allTasks.splice(index, 1);

    this.updateActiveTasks();
  }

  updateCompleted(id, action) {
    const index = this.allTasks.findIndex((task) => task.id === id);
    const task = this.allTasks[index];

    action === "check" ? (task.isCompleted = true) : (task.isCompleted = false);

    this.updateActiveTasks();
  }

  updateActiveTasks() {
    this.activeTasks = this.allTasks.filter(
      (task) => task.isCompleted == false
    );

    this.completedTasks = this.allTasks.filter(
      (task) => task.isCompleted == true
    );
  }

  displayTask(task, dragging = true) {
    return `
      <div class="todo__item" draggable="${
        dragging ? "true" : "false"
      }" data-id="${task.id}">
        <input
          class="todo__item__checkbox"
          type="checkbox"
          name="todo-item"
          id="${task.id}"

          ${task.isCompleted === true ? "checked" : ""}
        />
        <div class="todo__item__icon todo__item__icon--check" data-role="check">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
            <path
              fill="none"
              stroke="#FFF"
              stroke-width="2"
              d="M1 4.304L3.696 7l6-6"
            />
          </svg>
        </div>
        <label class="todo__item__text" for="${task.id}"
          >${task.text}
        <div class="todo__item__icon todo__item__icon--delete" data-role="delete"> 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
          >
            <path
              fill-rule="evenodd"
              d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
            />
          </svg>
        </div>
      </div>
    `;
  }

  updateTasksList(array, dragging) {
    const html = array.map((task) => this.displayTask(task, dragging)).join("");

    this.container.innerHTML = "";
    this.container.insertAdjacentHTML("beforeend", html);
  }

  updateItemsLeft() {
    const itemsLeft = this.activeTasks.length;

    if (itemsLeft === 0) return "Go do something fun";

    if (itemsLeft === 1) return "One item left";

    if (itemsLeft > 1) return `${itemsLeft} Items left`;
  }

  clearCompletedTasks() {
    this.allTasks = this.allTasks.filter((task) => task.isCompleted === false);
    this.updateActiveTasks();
  }

  saveToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(this.allTasks));
  }
}

export default new TodoList();
