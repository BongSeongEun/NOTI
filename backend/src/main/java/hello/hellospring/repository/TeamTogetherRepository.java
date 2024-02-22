package hello.hellospring.repository;

import hello.hellospring.model.Team;
import hello.hellospring.model.TeamTogether;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamTogetherRepository extends JpaRepository<TeamTogether, Long> {
    List<TeamTogether> findByUserId(Long userId);
    List<TeamTogether> findByTeamId(String teamId);
    void deleteByTeamIdAndUserId(String teamId, Long userId);
}
