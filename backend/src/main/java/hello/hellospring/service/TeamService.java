package hello.hellospring.service;

import hello.hellospring.model.TeamMemo;
import hello.hellospring.repository.TeamMemoRepository;
import hello.hellospring.repository.TeamRepository;
import hello.hellospring.repository.TeamTodoRepository;
import hello.hellospring.repository.TeamTogetherRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TeamService {

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    TeamTodoRepository teamTodoRepository;

    @Autowired
    TeamMemoRepository teamMemoRepository;

    @Autowired
    TeamTogetherRepository teamTogetherRepository;


}
