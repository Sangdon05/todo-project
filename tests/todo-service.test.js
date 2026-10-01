import { TodoMockStorageService } from '../src/services/database-service.js'
import { TodoService } from '../src/services/todo-service.js'

const storage = new TodoMockStorageService();
const todo1 = new TodoService(storage);

todo1.addEventListener("didUpdate", function () {
  console.log("데이터 업데이트 완료!");
});

todo1.add("테스트1", "테스트1 내용");
console.log(todo1.items);

todo1.add("테스트2", "테스트2 내용");
todo1.add("테스트3", "테스트3 내용");
todo1.add("테스트4", "테스트4 내용");

const modifyData = todo1.items[1];
todo1.update(modifyData.id, "테스트2 (수정)");
todo1.update(modifyData.id, null, "테스트2 내용 (수정)");

const archiveData = todo1.items[2];
todo1.archive(archiveData.id);

const deleteData = todo1.items[3];
todo1.delete(deleteData.id);
console.log("삭제 여부: ", todo1.items.length == 3);


const todo2 = new TodoService(storage);
console.log(todo2.items);
