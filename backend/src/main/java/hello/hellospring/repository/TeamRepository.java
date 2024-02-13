package hello.hellospring.repository;

import hello.hellospring.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByTeamId(Long teamId);
}
