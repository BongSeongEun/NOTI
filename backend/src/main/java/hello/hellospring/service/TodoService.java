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
    public List<Todo> retrieve(String userCode){
        return todoRepository.findByUserCode(userCode);
    }

    @Transactional
    public List<Todo> create(Todo todo) {
        validateEmptyTodoTile(todo);
        todoRepository.save(todo);

        return todoRepository.findByUserCode(todo.getUserCode());
    }
    @Transactional
    public List<Todo> update(Todo todo){
        validateEmptyTodoTile(todo);

        Optional<Todo> original = todoRepository.findById(todo.getId());

        if(original.isPresent()){
            Todo newTodo = original.get();
            newTodo.setTitle(todo.getTitle());
            newTodo.setDone(todo.isDone());
            newTodo.setTime(todo.getTime());

            todoRepository.save(newTodo);
        }
        return retrieve(todo.getUserCode());
    }

    @Transactional
    public List<Todo> delete(final Todo todo, TodoDTO todoDTO){
        try{
            todoRepository.delete(todo);
        } catch(Exception e){
            throw new RuntimeException("error deleting entity" + todo.getId());
        }
        return retrieve(todo.getUserCode());
    }

    private void validateEmptyTodoTile(Todo todo) {
        if (todo.getTitle().equals("") || todo.getTitle() == null) {
            throw new AppException(NO_TITLE_ENTERED);
        }
    }

}
