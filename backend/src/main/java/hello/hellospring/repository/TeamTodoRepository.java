package hello.hellospring.repository;

import hello.hellospring.model.TeamTodo;

public interface TeamTodoRepository {
    public TeamTodo findByteamId(Long teamId);
}
