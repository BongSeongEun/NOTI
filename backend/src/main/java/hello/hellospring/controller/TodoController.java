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
@AllArgsConstructor
public class TodoController {

    @Autowired
    private TodoService todoService;

    @Autowired
    private TodoRepository todoRepository;

    @PostMapping("/api/v1/createTodo/{userId}")
    public ResponseEntity<?> createTodo(@PathVariable String userId, @RequestBody TodoDTO todoDTO){
        Todo entity = TodoDTO.toEntity(todoDTO);
        entity.setUserId(Long.valueOf(userId));
        List<Todo> todoEntity = todoService.createTodo(entity);
        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntity);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/v1/updateTodo/{userId}")
    public ResponseEntity<?> updateTodo(@PathVariable HttpServletRequest userId, @RequestBody TodoDTO todoDTO){
        Todo todoEntity = TodoDTO.toEntity(todoDTO);
        todoEntity.setUserId(Long.valueOf(String.valueOf(userId)));
        List<Todo> todoEntities = todoService.update(todoEntity, userId);
        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntities);
        return ResponseEntity.ok().body(dtos);
    }

    @GetMapping("/api/v1/getTodo/{userId}")
    public ResponseEntity<?> getTodo(@PathVariable HttpServletRequest userId){
        List<Todo> todoEntity = todoService.getTodo(userId);
        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntity);
        return ResponseEntity.ok().body(dtos);
    }

    @DeleteMapping("/api/v1/deleteTodo/{userId}")
    public ResponseEntity<?> deleteTodo(@PathVariable HttpServletRequest userId, @RequestBody TodoDTO todoDTO){
        Todo todoEntity = TodoDTO.toEntity(todoDTO);

        todoEntity.setUserId(Long.valueOf(String.valueOf(userId)));

        List<Todo> todoEntities = todoService.delete(todoEntity, todoDTO, userId);

        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntities);

        return ResponseEntity.ok().body(dtos);
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
