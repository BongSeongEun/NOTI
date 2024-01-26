package hello.hellospring.service;

import hello.hellospring.Exception.AppException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static hello.hellospring.Exception.ErrorCode.NO_TITLE_ENTERED;

@Slf4j
@Service
public class TodoService {
    @Autowired
    TodoRepository todoRepository;

    @Transactional(readOnly = true)
    public List<Todo> retrieve(String userId){
        return todoRepository.findByUserId(Long.valueOf(userId));
    }

    @Transactional
    public List<Todo> create(Todo todo) {
        validateEmptyTodoTile(todo);
        todoRepository.save(todo);

        return todoRepository.findByUserId(todo.getUserId());
    }
    @Transactional
    public List<Todo> update(Todo todo){
        validateEmptyTodoTile(todo);

        Optional<Todo> original = todoRepository.findById(String.valueOf(todo.getUserId()));

        if(original.isPresent()){
            Todo newTodo = original.get();
            newTodo.setTodoTitle(todo.getTodoTitle());
            newTodo.setTodoDate(todo.getTodoDate());
            newTodo.setTodoStartTime(todo.getTodoStartTime());
            newTodo.setTodoEndTime(todo.getTodoEndTime());
            newTodo.setTodoDone(todo.isTodoDone());

            todoRepository.save(newTodo);
        }
        return retrieve(String.valueOf(todo.getUserId()));
    }

    @Transactional
    public List<Todo> delete(final Todo todo, TodoDTO todoDTO){
        try{
            todoRepository.delete(todo);
        } catch(Exception e){
            throw new RuntimeException("error deleting entity" + todo.getTodoId());
        }
        return retrieve(String.valueOf(todo.getUserId()));
    }

    private void validateEmptyTodoTile(Todo todo) {
        if (todo.getTodoTitle().equals("") || todo.getTodoTitle() == null) {
            throw new AppException(NO_TITLE_ENTERED);
        }
    }

}
