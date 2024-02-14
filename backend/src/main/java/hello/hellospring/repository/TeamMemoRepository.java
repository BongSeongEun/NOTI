package hello.hellospring.repository;

import hello.hellospring.model.Team;
import hello.hellospring.model.TeamMemo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemoRepository extends JpaRepository<TeamMemo, Long> {
    public TeamMemo findByTeamId(Long teamId);
}
