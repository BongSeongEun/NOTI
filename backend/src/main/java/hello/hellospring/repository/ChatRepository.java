package hello.hellospring.repository;

import hello.hellospring.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByUserId(Long userId);
}
