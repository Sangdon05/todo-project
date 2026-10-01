import { TodoService } from './services/TodoService.js';
import { TodoLocalStorageService } from './services/database-service.js';

const storage = TodoLocalStorageService();
const todo = TodoService(storage);

window.addEventListener("DOMContentLoaded", () => {
  console.log(todo.items);
});
