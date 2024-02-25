package hello.hellospring.repository;

import hello.hellospring.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId);
    List<Todo> findByTodoId(Long TodoId);
    Todo findByTodoIdAndUserId(Long todoId, Long userId);
    void deleteByTodoIdAndUserId(Long todoId, Long userId);

    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.todoDate = :todoDateStr")
    List<Todo> findByUserIdAndTodoDate(
            @Param("userId") Long userId,
            @Param("todoDateStr") String todoDateStr);


    List<Todo> findByTodoDateAndTodoEndTime(String format, String format1);
    // gpt 관련으로 추가함, 혹시 오류 발생시 없애버려주세요
}
