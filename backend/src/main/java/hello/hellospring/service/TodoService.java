package hello.hellospring.service;

import hello.hellospring.Exception.AppException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Todo update(TodoDTO todoDTO, Long userId, Long todoId) {
        Todo originalTodo = todoRepository.findByTodoIdAndUserId(todoId, userId);

        originalTodo.setTodoTitle(todoDTO.getTodoTitle());
        originalTodo.setTodoStartTime(todoDTO.getTodoStartTime());
        originalTodo.setTodoEndTime(todoDTO.getTodoEndTime());
        originalTodo.setTodoColor(todoDTO.getTodoColor());
        originalTodo.setTodoDone(todoDTO.isTodoDone());
        originalTodo.setTodoDate(todoDTO.getTodoDate());

        todoRepository.save(originalTodo);

        return originalTodo;
    }

    public List<Todo> getTodo(String userId){
        return todoRepository.findByUserId(Long.valueOf(userId));
    }

    @Transactional
    public List<Todo> delete(String userId, String todoId){
            todoRepository.deleteByTodoIdAndUserId(Long.valueOf(todoId), Long.valueOf(userId));
        return getTodo(userId);
    }


    private void validateEmptyTodoTile(Todo todo) {
        if (todo.getTodoTitle().equals("") || todo.getTodoTitle() == null) {
            throw new AppException(NO_TITLE_ENTERED);
        }
    }

    public int countCompletedTodosByMonthAndUserId(Long userId, String month) {
        List<Todo> allTodos = todoRepository.findAllTodosByMonthAndUserId(userId, month);
        List<Todo> completedTodos = todoRepository.findCompletedTodosByMonthAndUserId(userId, month);

        // 모든 일정의 수
        int totalTodos = allTodos.size();
        // 완료된 일정의 수
        int completedTodosCount = completedTodos.size();

        // 모든 일정 중에서 달성한 일정의 비율 계산
        double completionRate = 0;
        if (totalTodos > 0) { // 분모가 0이 되는 경우를 방지
            completionRate = ((double) completedTodosCount / totalTodos) * 100;
        }

        System.out.println("이번달 일정 :" + totalTodos);
        System.out.println("일정 중 달성갯수 :" + completedTodosCount);

        return (int) completionRate;
    }
}
