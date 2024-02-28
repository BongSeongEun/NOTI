package hello.hellospring.repository;

import hello.hellospring.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Modifying
    @Transactional
    @Query("update Todo t set t.todoDone = true where t.userId = ?1 and t.todoDate = ?2 and t.todoTitle = ?3")
    int updateTodoDoneByUserIdAndTodoDateAndTodoTitle(Long userId, String parse, String finishedTodo);
    // gpt 관련으로 추가함, 혹시 오류 발생시 없애버려주세요

    List<Todo> findByUserIdAndTodoDateAndTodoDone(Long userId, String formattedToday, boolean b);
    // gpt 관련으로 추가함, 혹시 오류 발생시 없애버려주세요
}
