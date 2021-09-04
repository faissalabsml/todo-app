// Source: https://www.youtube.com/watch?v=jfYWwQrtzzY

import todoList from "./todo.js";
import { currentFilter } from "./todoView.js";

export const dragAndDrop = function () {
  const currentFilter = document.querySelector("input[name='filter']:checked");
  const todoItemsContainer = document.querySelector(".todo__list__body");
  let todoItems = [...todoList.container.children];

  // Attach event listener to all items
  todoItems.forEach((item) => {
    // On start
    item.addEventListener("dragstart", () => {
      item.classList.add("dragging");
    });

    // On finish
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");

      // Re-assign todoItems according to the new sort
      todoItems = [...todoList.container.children];

      // Get the id and it's new index of the moved item in todoItems array
      const movedItemID = item.dataset.id;
      const newIndex = todoItems.findIndex(
        (item) => item.dataset.id === movedItemID
      );

      // Delete task from it's previous index and push it again with new position
      const task = todoList.allTasks.find((task) => task.id === movedItemID);
      todoList.deleteTask(movedItemID);
      todoList.allTasks.splice(newIndex, 0, task);

      // Update active and completed tasks arrays and save that to local storage
      todoList.updateActiveTasks();
      todoList.saveToLocalStorage();
    });
  });

  // Find element closed to our dragged element and insert before or after it
  todoItemsContainer.addEventListener("dragover", (e) => {
    const currentElement = todoItemsContainer.querySelector(".dragging");
    const afterElement = getDragAfterElement(todoItemsContainer, e.clientY);

    if (afterElement == null) {
      todoItemsContainer.appendChild(currentElement);
    } else {
      todoItemsContainer.insertBefore(currentElement, afterElement);
    }
  });

  // Find the closest element
  const getDragAfterElement = function (container, y) {
    const otherElements = [
      ...todoItemsContainer.querySelectorAll(".todo__item:not(.dragging)"),
    ];

    return otherElements.reduce(
      (closestElement, element) => {
        const box = element.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closestElement.offset) {
          return { offset: offset, element: element };
        } else {
          return closestElement;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };
};
