package hello.hellospring.repository;

import hello.hellospring.model.Team;

public interface TeamRepository {
    public Team findByTeamId(Long teamId);
}
