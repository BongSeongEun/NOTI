package hello.hellospring.service;

import hello.hellospring.Exception.AppException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static hello.hellospring.Exception.ErrorCode.NO_TITLE_ENTERED;

@Service
public class TodoService {

    private final TodoRepository todoRepository;
    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }
//    public List<Todo> createTodo(Todo todo){
//        validateEmptyTodoTile(todo);
//        todoRepository.save(todo);
//
//        return todoRepository.findByUserId(todo.getUserId());
//    }

    public List<TodoDTO> getTodosByUserId(Long userId) {
        return todoRepository.findByUserId(userId).stream()
                .map(TodoDTO::new) // Todo -> TodoDTO 변환 (TodoDTO 생성자 또는 메서드가 필요함)
                .collect(Collectors.toList());
    }

    public TodoDTO createTodo(TodoDTO todoDTO) {
        Todo todo = todoRepository.save(todoDTO.toEntity());
        return new TodoDTO(todo);
    }

    public TodoDTO updateTodo(Long todoId, TodoDTO todoDTO) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found with id " + todoId));
        // 업데이트 로직 추가
        todo.setTodoTitle(todoDTO.getTodoTitle());
        todo.setTodoStartTime(todoDTO.getTodoStartTime());
        todo.setTodoEndTime(todoDTO.getTodoEndTime());
        todo.setTodoColor(todoDTO.getTodoColor());
        todo.setTodoDone(todoDTO.isTodoDone());
        todo.setTodoDate(todoDTO.getTodoDate());
        todo = todoRepository.save(todo);
        return new TodoDTO(todo);
    }

    public void deleteTodo(Long todoId) {
        todoRepository.deleteById(todoId);
    }






//
//
//
//    public List<Todo> update(Todo todo, HttpServletRequest request) {
//        validateEmptyTodoTile(todo);
//
//        List<Todo> original = getPresentTodo(request);
//        Todo newTodo = null;
//        if (original.isEmpty()) {
//            newTodo = (Todo) original;
//            newTodo.setTodoTitle(todo.getTodoTitle());
//            newTodo.setTodoStartTime(todo.getTodoStartTime());
//            newTodo.setTodoEndTime(todo.getTodoEndTime());
//            newTodo.setTodoColor(todo.getTodoColor());
//            newTodo.setTodoDone(todo.isTodoDone());
//
//            todoRepository.save(newTodo);
//        }
//        return (List<Todo>) newTodo;
//    }
//
//    public List<Todo> getTodo(HttpServletRequest request){
//        Long userId = (Long) request.getAttribute("userId");
//        Todo todo = (Todo) todoRepository.findByUserId(userId);
//        return (List<Todo>) todo;
//    }
//
//    public List<Todo> getPresentTodo(HttpServletRequest request){
//        Long todoId = (Long) request.getAttribute("todoId");
//        Todo todo = (Todo) todoRepository.findByTodoId(todoId);
//        return (List<Todo>) todo;
//    }
//
//    public List<Todo> delete(final Todo todo, TodoDTO todoDTO, HttpServletRequest request){
//        try{
//            todoRepository.delete(todo);
//        } catch(Exception e){
//            throw new RuntimeException("error deleting entity" + todo.getTodoId());
//        }
//        return getTodo((HttpServletRequest) request.getAttribute("userId"));
//    }
//
//    private void validateEmptyTodoTile(Todo todo) {
//        if (todo.getTodoTitle().equals("") || todo.getTodoTitle() == null) {
//            throw new AppException(NO_TITLE_ENTERED);
//        }
//    }

}
