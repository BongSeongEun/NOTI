package hello.hellospring.repository;

import hello.hellospring.model.Team;
import hello.hellospring.model.TeamTodo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamTodoRepository extends JpaRepository<TeamTodo, Long> {
    public TeamTodo findByteamId(Long teamId);
}
