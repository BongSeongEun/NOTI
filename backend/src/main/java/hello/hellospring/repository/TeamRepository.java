package hello.hellospring.repository;

import hello.hellospring.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
    public Team findByTeamId(Long teamId);
}
