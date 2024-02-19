package hello.hellospring.repository;

import hello.hellospring.dto.TeamTodoDTO;
import hello.hellospring.model.Team;
import hello.hellospring.model.TeamMemo;
import hello.hellospring.model.TeamTodo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemoRepository extends JpaRepository<TeamMemo, Long> {
    public List<TeamMemo> findByTeamId(String teamId);
    public TeamMemo findByTeamIdAndTeamMemoId(String teamId, Long teamMemoId);
    void deleteByTeamIdAndTeamMemoId(String teamId, Long teamMemoId);
}