package hello.hellospring.repository;

import hello.hellospring.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId);
    List<Todo> findByTodoId(Long TodoId);
    Todo findByTodoIdAndUserId(Long todoId, Long userId);
    void deleteByTodoIdAndUserId(Long todoId, Long userId);

}
