package hello.hellospring.repository;

import hello.hellospring.model.Team;
import hello.hellospring.model.TeamTodo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamTodoRepository extends JpaRepository<TeamTodo, Long> {
    List<TeamTodo> findByteamId(String teamId);
    void deleteByTeamIdAndTeamTodoId(String teamId, Long teamTodoId);
    TeamTodo findByTeamIdAndTeamTodoId(String teamId, Long teamTodoId);

}
