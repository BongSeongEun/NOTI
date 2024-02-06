package hello.hellospring.controller;

import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.TodoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/")
public class TodoController {

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping("/createTodo/{userId}")
    public ResponseEntity<?> createTodo(@PathVariable String userId, @RequestBody TodoDTO todoDTO){
        Todo entity = TodoDTO.toEntity(todoDTO);
        entity.setUserId(Long.valueOf(userId));
        List<Todo> todoEntity = todoService.createTodo(entity);
        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntity);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/updateTodo/{userId}/{todoId}")
    public ResponseEntity<TodoDTO> updateTodo(@PathVariable Long userId, @PathVariable Long todoId, @RequestBody TodoDTO todoDTO){
        Todo updatedTodo = todoService.update(todoDTO, userId, todoId);
        TodoDTO dto = TodoDTO.from(updatedTodo); // 해당 변환 로직 구현 필요
        return ResponseEntity.ok().body(dto);
    }

    @GetMapping("/getTodo/{userId}")
    public ResponseEntity<?> getTodo(@PathVariable String userId){
        List<Todo> todoEntity = todoService.getTodo(userId);
        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntity);
        return ResponseEntity.ok().body(dtos);
    }

    @DeleteMapping("/deleteTodo/{userId}/{todoId}")
    public ResponseEntity<?> deleteTodo(@PathVariable String userId, @PathVariable String todoId) {
        todoService.delete(userId, todoId);
        return ResponseEntity.ok().build(); // 200 OK와 내용 없이 응답
    }

    private List<TodoDTO> makeDtoListFromEntityList( List<Todo> todoEntities ){
        List<TodoDTO> todoDTOList = new ArrayList<>();

        for(Todo todoEntity : todoEntities){
            TodoDTO todoDTO = TodoDTO.builder()
                    .todoId(todoEntity.getTodoId())
                    .todoTitle(todoEntity.getTodoTitle())
                    .todoDone(todoEntity.isTodoDone())
                    .todoStartTime(todoEntity.getTodoStartTime())
                    .todoEndTime(todoEntity.getTodoEndTime())
                    .todoColor(todoEntity.getTodoColor())
                    .userId(todoEntity.getUserId())
                    .todoDate(todoEntity.getTodoDate())
                    .build();

            todoDTOList.add(todoDTO);
        }

        return todoDTOList;
    }


}
