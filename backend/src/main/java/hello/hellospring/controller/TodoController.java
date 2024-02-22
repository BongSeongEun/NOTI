package hello.hellospring.controller;

import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.TeamSchedule;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TeamScheduleRepository;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.TodoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/")
public class TodoController {
    private final TodoService todoService;
    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @Autowired
    TodoRepository todoRepository;

    @Autowired
    TeamScheduleRepository teamScheduleRepository;

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
        TodoDTO dto = TodoDTO.from(updatedTodo);
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

    @GetMapping("/getTodoState/{userId}/{teamId}")
    public ResponseEntity<?> getTodoState(@PathVariable String userId, @PathVariable String teamId) {
        List<Todo> userTodo = todoRepository.findByUserId(Long.valueOf(userId));
        List<TeamSchedule> teamTodo = teamScheduleRepository.findByTeamId(teamId);

        Set<Long> teamTodoIds = teamTodo.stream()
                .map(TeamSchedule::getTodoId)
                .collect(Collectors.toSet());

        List<Map<String, Object>> todoDTOsWithState = userTodo.stream().map(todo -> {
            Map<String, Object> todoWithState = new HashMap<>();
            todoWithState.put("todoId", todo.getTodoId());
            todoWithState.put("userId", todo.getUserId());
            todoWithState.put("todoTitle", todo.getTodoTitle());
            todoWithState.put("todoStartTime", todo.getTodoStartTime());
            todoWithState.put("todoEndTime", todo.getTodoEndTime());
            todoWithState.put("todoColor", todo.getTodoColor());
            todoWithState.put("todoDone", todo.isTodoDone());
            todoWithState.put("todoDate", todo.getTodoDate());
            todoWithState.put("state", teamTodoIds.contains(todo.getTodoId()));

            return todoWithState;
        }).collect(Collectors.toList());

        return ResponseEntity.ok().body(todoDTOsWithState);
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
