package hello.hellospring.repository;

import hello.hellospring.model.TeamMemo;

public interface TeamMemoRepository {
    public TeamMemo findByTeamId(Long teamId);
}
