export class TodoDatabaseInterface {
  constructor() {
    if (new.target === TodoDatabaseInterface) {
      throw new TypeError("인터페이스 객체를 직접 생성할수 없습니다.")
    }
  }

  // 저장된 자료를 읽어 반환한다.
  load() {
    throw new Error("load 메서드 미정의")
  }

  // 저장할 객체
  save(data) {
    throw new Error("save 메서드 미정의")
  }
}

export class TodoLocalStorageService extends TodoDatabaseInterface {
  constructor() {
    super();
    this.storage = localStorage;
  }

  load() {
    const data = this.storage.getItem("todos");

    if (!data) return null;

    return JSON.parse(data);
  }

  save(data) {
    this.storage.setItem("todos", JSON.stringify(data));
  }
}

export class TodoMockStorageService extends TodoDatabaseInterface {
  constructor() {
    super();
    this.storage = {};
  }

  load() {
    const data = this.storage["todos"];

    if (!data) return null;

    return JSON.parse(data);
  }

  save(data) {
    this.storage["todos"] = JSON.stringify(data);
  }
}
