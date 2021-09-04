import todoList from "./todo.js";

const toggleBtn = document.querySelector(".toggle-theme-btn");
const overlay = document.querySelector(".overlay");
const htmlDocument = document.querySelector("html");

const changeTheme = function () {
  if (htmlDocument.dataset.theme === "dark") {
    htmlDocument.dataset.theme = "light";
  } else {
    htmlDocument.dataset.theme = "dark";
  }

  toggleBtn.classList.toggle("active");
  overlay.classList.toggle("active");

  localStorage.setItem("theme", JSON.stringify(htmlDocument.dataset.theme));
};

htmlDocument.dataset.theme = todoList.theme;

toggleBtn.addEventListener("click", () => changeTheme());
