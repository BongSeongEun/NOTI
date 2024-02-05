package hello.hellospring.service;

import hello.hellospring.Exception.AppException;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static hello.hellospring.Exception.ErrorCode.NO_TITLE_ENTERED;

@Service
@AllArgsConstructor
public class TodoService {
    @Autowired
    TodoRepository todoRepository;

    public List<Todo> createTodo(Todo todo){
        validateEmptyTodoTile(todo);
        todoRepository.save(todo);

        return todoRepository.findByUserId(todo.getUserId());
    }
    private void validateEmptyTodoTile(Todo todo) {
        if (todo.getTodoTitle().equals("") || todo.getTodoTitle() == null) {
            throw new AppException(NO_TITLE_ENTERED);
        }
    }

}
