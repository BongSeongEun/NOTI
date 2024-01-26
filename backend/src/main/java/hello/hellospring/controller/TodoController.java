package hello.hellospring.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.service.TodoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1")
public class TodoController {

    @Autowired
    private TodoService service;
    @GetMapping("/getTodo")
    public ResponseEntity<?> getTodo(@AuthenticationPrincipal String userId) {
        List<Todo> todoEntity = service.retrieve(userId);

        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntity);

        return ResponseEntity.ok().body(dtos);

    }

    @PostMapping("/createTodo")
    public ResponseEntity<?> createTodo(@AuthenticationPrincipal String userId, @RequestBody TodoDTO todoDTO){
        Todo entity = TodoDTO.toEntity(todoDTO);

        entity.setTodoId(null);
        entity.setUserId(Long.valueOf(userId));
        List<Todo> todoEntity = service.create(entity);
        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntity);

        return ResponseEntity.ok().body(dtos);

    }

    @PutMapping("/updateTodo")
    public ResponseEntity<?> updateTodo(@AuthenticationPrincipal String userId, @RequestBody TodoDTO todoDTO){
        Todo todoEntity = TodoDTO.toEntity(todoDTO);

        todoEntity.setUserId(Long.valueOf(userId));

        List<Todo> todoEntities = service.update(todoEntity);

        List<TodoDTO> dtos = makeDtoListFromEntityList(todoEntities);

        return ResponseEntity.ok().body(dtos);
    }

    @DeleteMapping("/deleteTodo")
    public ResponseEntity<?> deleteTodo(@AuthenticationPrincipal String userId, @RequestBody TodoDTO todoDTO){
        Todo todoEntity = TodoDTO.toEntity(todoDTO);

        todoEntity.setUserId(Long.valueOf(userId));

        List<Todo> todoEntities = service.delete(todoEntity, todoDTO);

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
