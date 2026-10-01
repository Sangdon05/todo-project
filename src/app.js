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
  update(todo) {
    this.service.update(todo.id, todo.title, todo.content);
  },
  delete(id) {
    this.service.delete(id);
  },
  searchWithID(id) {
    const result = this.service.searchWithID(id);
    if (result.length == 0) {
      return null;
    } else {
      return result[0];
    }
  }
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
      item.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete")) {
          const id = e.currentTarget.id;
          todoView.showComfirmModal(function () {
            // 삭제
            todoList.delete(id);
          });
        } else if (e.target.classList.contains("edit")) {
          const id = e.currentTarget.id;
          const selectedTodo = todoList.searchWithID(id);
          if (selectedTodo) {
            todoView.showEditModal(todo, function (edited) {
              todoList.update(edited);
            });
          }
        }
      });
      return item;
    });

    this.todoListView.replaceChildren(...items);
  },
  showComfirmModal(callback) {
    const confirmModal = this.confirmModal;
    confirmModal.showModal();
    confirmModal.querySelector(".confirm").onclick = function () {
      callback();
      confirmModal.close();
    };
    confirmModal.querySelector(".cancel").onclick = function () {
      confirmModal.close();
    };
  },
  showEditModal(todo, callback) {
    const editModal = this.editModal;
    const title = editModal.querySelector("#edit-title");
    const content = editModal.querySelector("#edit-content");

    title.value = todo.title;
    content.value = todo.content;
    editModal.showModal();
    editModal.querySelector(".cancel").onclick = function () {
      editModal.close();
    };

    editModal.querySelector(".save").onclick = function () {
      if (title.value && content.value) {
        callback({ ...todo, title: title.value, content: content.value });
        editModal.close();
      }
    };
  },
  emptyView: document.querySelector(".todo-list-empty"),
  todoListView: document.querySelector(".todo-list"),
  addTodoButton: document.getElementById("add-todo"),
  confirmModal: document.getElementById("confirm-modal"),
  editModal: document.getElementById("edit-modal"),
  todoFormView: formTodo,
  getTodoItemTemplate() {
    const template = `
    <li class="todo rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h3 class="title truncate font-semibold text-gray-900"></h3>
          <p class="content mt-1 text-sm text-gray-600 wrap-break-word"></p>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
        <button class="edit rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50" type="button">수정</button>
        <button class="delete rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100">삭제</button>
      </div>
    </li>
    `;
    return htmlToElement(template);
  },
}

window.addEventListener("DOMContentLoaded", function () {
  todoList.setup();
  todoView.setup();
});
