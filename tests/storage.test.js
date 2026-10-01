import { TodoMockStorageService } from '../src/services/database-service.js';

const storage = new TodoMockStorageService();
const items = storage.load() || [];

items.push({
  id: crypto.randomUUID(), title: "테스트", content: "테스트 내용입니다."
});

console.log(items);


storage.save(items);
const loadedItems = storage.load();
console.log(loadedItems);


console.log(loadedItems[0]["id"] == items[0]["id"]);
