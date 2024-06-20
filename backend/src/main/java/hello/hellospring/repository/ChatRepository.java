package hello.hellospring.repository;

import hello.hellospring.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByUserId(Long userId);

    @Query("SELECT c FROM Chat c WHERE c.userId = :userId AND c.chatDate BETWEEN :startTime AND :endTime")
    // chat에서 userId가 지정한 chatDate (startTime~endTime) 사이의 chat만 가져오기
    List<Chat> findChatsByUserIdAndTimeRange(
            @Param("userId") Long userId,
            @Param("startTime") LocalDateTime startOfPreviousDay, //현재시간으로부터 24시간 전 시간
            @Param("endTime") LocalDateTime now); //현재시간

    Optional<Chat> findFirstByUserIdAndTodoFinishAskTrueOrderByChatDateDesc(Long userId);
}
