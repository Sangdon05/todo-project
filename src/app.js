import { TodoService } from './services/todo-service.js';
import { TodoLocalStorageService } from './services/database-service.js';
import { htmlToElement } from './utils/create-html-element.js';

const todoList = {
  service: new TodoService(new TodoLocalStorageService()),
  setup() {
    todoList.service.addEventListener("didUpdate", function (e) {
      todoList.refresh();
    });
    todoList.refresh();
  },
  refresh() {
    const todos = this.service.todos;
    todoView.showTodoList(todos);
  },
  add(title, content) {
    try {
      this.service.add(title, content);
    } catch (e) {
      // todo: 입력값 오류 표시
    }
  },
  delete(id) {
    this.service.delete(id);
  },
}

const todoView = {
  setup() {
    this.addTodoButton.addEventListener("click", function (e) {
      e.preventDefault();
      const form = todoView.todoFormView;

      const title = form.title.value;
      const content = form.content.value;

      if (!title || !content) {
        if (!title) {
          form.title.focus();
        } else {
          form.content.focus()
        }
        return;
      };

      todoList.add(title, content);

      form.title.value = "";
      form.content.value = "";
    });
  },
  showTodoList(todos) {
    if (todos.length != 0) {
      this.emptyView.setAttribute("hidden", true);
      this.todoListView.removeAttribute("hidden");

      this.render(todos);
    } else {
      this.emptyView.removeAttribute("hidden");
      this.todoListView.setAttribute("hidden", true);
    }
  },
  render(todos) {
    const items = todos.map((todo) => {
      const item = todoView.getTodoItemTemplate();
      item.getElementsByClassName("title")[0].textContent = todo.title;
      item.getElementsByClassName("content")[0].textContent = todo.content;
      item.id = todo.id;
      item.getElementsByClassName("delete")[0].addEventListener("click", function (e) {
        todoList.delete(e.target.parentElement.id);
      });
      return item;
    });

    this.todoListView.replaceChildren(...items);
  },
  emptyView: document.querySelector(".todo-list-empty"),
  todoListView: document.querySelector(".todo-list"),
  addTodoButton: document.getElementById("add-todo"),
  todoFormView: formTodo,
  getTodoItemTemplate() {
    const template = `
    <li class="todo">
      <span class="title"></span>
      <span class="content"></span>
      <time class="created"></time>
      <button class="modify" type="button">수정</button>
      <button class="delete" type="button">삭제</button>
    </li>
    `;
    return htmlToElement(template);
  },
}

window.addEventListener("DOMContentLoaded", function () {
  todoList.setup();
  todoView.setup();
});
