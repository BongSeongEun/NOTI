package hello.hellospring.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.TodoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
