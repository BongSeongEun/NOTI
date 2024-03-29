package hello.hellospring.repository;

import hello.hellospring.model.TeamSchedule;
import hello.hellospring.model.TeamTogether;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamScheduleRepository extends JpaRepository<TeamSchedule, Long> {
    List<TeamSchedule> findByTeamId(String teamId);
    List<TeamSchedule> findByTodoId(Long todoId);
    TeamSchedule findByTeamIdAndTodoId(String teamId, Long todoId);

    void deleteByTeamIdAndTodoId(String teamId, Long todoId);
}
