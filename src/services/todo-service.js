import { TodoDatabaseInterface } from './database-service.js';

export class TodoService extends EventTarget {
  constructor(database) {
    if (!(database instanceof TodoDatabaseInterface)) {
      throw new TypeError("TodoDatabaseInterface 타입이 아닙니다.")
    }
    super();
    this.database = database;
    this.items = database.load() || [];
  }

  // 할일 추가
  add(title, content) {
    const data = {
      id: crypto.randomUUID(),
      title,
      content,
      completed: false,
      createdAt: Date.now(),
    }
    this.items.push(data);
    this.didUpdate();
    this.save();
  }
  // 할일 수정
  update(id, title = null, content = null) {
    this.items = this.items.map((data) => {
      if (data.id == id) {
        const newData = { ...data };
        title && (newData.title = title);
        content && (newData.content = content);
        newData.modifiedAt = Date.now();
        return newData;
      } else {
        return data;
      }
    });
    this.didUpdate();
    this.save();
  }
  // 할일 보관 처리 (소프트 삭제)
  archive(id) {
    this.items = this.items.map((data) => {
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
    const index = this.items.findIndex((data) => data.id == id);
    if (index != -1) {
      this.items = this.items.filter((data) => data.id != id);
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
    this.database.save(this.items);
  }
}
