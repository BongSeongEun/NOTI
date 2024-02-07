package hello.hellospring.repository;

import hello.hellospring.model.Team;
import hello.hellospring.model.TeamTogether;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamTogetherRepository extends JpaRepository<TeamTogether, Long> {
    public TeamTogether findByUserId(Long userId);
}
