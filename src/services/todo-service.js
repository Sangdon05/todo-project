import { TodoDatabaseInterface } from './database-service.js';

export class TodoService extends EventTarget {
  constructor(database) {
    if (!(database instanceof TodoDatabaseInterface)) {
      throw new TypeError("TodoDatabaseInterface 타입이 아닙니다.")
    }
    super();
    this.database = database;
    this.todos = database.load() || [];
  }

  searchWithID(id) {
    return this.todos.filter((data) => data.id == id);
  }

  // 할일 추가
  add(title, content) {
    if (!title || !content) {
      throw new Error("필수 값 누락입니다.")
    }
    const data = {
      id: crypto.randomUUID(),
      title,
      content,
      completed: false,
      createdAt: Date.now(),
    }
    this.todos.push(data);
    this.didUpdate();
    this.save();
  }
  // 할일 수정
  update(id, title = null, content = null) {
    this.todos = this.todos.map((todo) => {
      if (todo.id == id) {
        const newData = { ...todo };
        title && (newData.title = title);
        content && (newData.content = content);
        newData.modifiedAt = Date.now();
        return newData;
      } else {
        return todo;
      }
    });
    this.didUpdate();
    this.save();
  }
  // 할일 보관 처리 (소프트 삭제)
  archive(id) {
    this.todos = this.todos.map((data) => {
      if (data.id == id) {
        return { ...data, archivedAt: Date.now() };
      } else {
        return data;
      }
    });
    this.didUpdate();
    this.save();
  }
  // 물리적 완전 삭제
  delete(id) {
    const index = this.todos.findIndex((data) => data.id == id);
    if (index != -1) {
      this.todos = this.todos.filter((data) => data.id != id);
      this.didUpdate();
      this.save();
    }
  }
  // items 수정 후 호출필요
  didUpdate() {
    const event = new CustomEvent("didUpdate");
    this.dispatchEvent(event);
  }
  // items 저장
  save() {
    this.database.save(this.todos);
  }
}
