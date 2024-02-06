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
    public List<Todo> createTodo(Todo todo){
        validateEmptyTodoTile(todo);
        todoRepository.save(todo);

        return todoRepository.findByUserId(todo.getUserId());
    }

    public List<Todo> update(Todo todo, String userId, String todoId) {
        validateEmptyTodoTile(todo);

        List<Todo> original = getPresentTodo(userId, todoId);
        Todo newTodo = null;
        if (original.isEmpty()) {
            newTodo = (Todo) original;
            newTodo.setTodoTitle(todo.getTodoTitle());
            newTodo.setTodoStartTime(todo.getTodoStartTime());
            newTodo.setTodoEndTime(todo.getTodoEndTime());
            newTodo.setTodoColor(todo.getTodoColor());
            newTodo.setTodoDone(todo.isTodoDone());

            todoRepository.save(newTodo);
        }
        return todoRepository.findByUserId(todo.getTodoId());
    }

    public List<Todo> getTodo(String userId){
        return todoRepository.findByUserId(Long.valueOf(userId));
    }

    public List<Todo> getPresentTodo(String userId, String todoId){
        Todo todo = (Todo) todoRepository.findByTodoId(Long.valueOf(todoId));
        return (List<Todo>) todo;
    }

    public List<Todo> delete(final Todo todo, TodoDTO todoDTO, String userId){
        try{
            todoRepository.delete(todo);
        } catch(Exception e){
            throw new RuntimeException("error deleting entity" + todo.getTodoId());
        }
        return getTodo(userId);
    }

    private void validateEmptyTodoTile(Todo todo) {
        if (todo.getTodoTitle().equals("") || todo.getTodoTitle() == null) {
            throw new AppException(NO_TITLE_ENTERED);
        }
    }

}
