package hello.hellospring.repository;

import hello.hellospring.model.TeamTogether;

public interface TeamTogetherRepository {
    public TeamTogether findByUserId(Long userId);
}
