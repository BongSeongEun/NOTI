package hello.hellospring.service;

import hello.hellospring.model.Team;
import hello.hellospring.model.TeamTodo;
import hello.hellospring.model.TeamTogether;
import hello.hellospring.repository.TeamMemoRepository;
import hello.hellospring.repository.TeamRepository;
import hello.hellospring.repository.TeamTodoRepository;
import hello.hellospring.repository.TeamTogetherRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<TeamTogether> getTeamList(String userId){
        return teamTogetherRepository.findByUserId(Long.valueOf(userId));
    }

    public List<TeamTogether> getUserList(String teamId){
        return teamTogetherRepository.findByTeamId(Long.valueOf(teamId));
    }

    public List<TeamTogether> createTeam(TeamTogether teamTogether){
        teamTogetherRepository.save(teamTogether);
        return teamTogetherRepository.findByUserId(teamTogether.getUserId());
    }

    public List<Team> createTeamTitle(Team team){
        teamRepository.save(team);
        return teamRepository.findByTeamId(team.getTeamId());
    }

    public List<TeamTodo> createTeamTodo(TeamTodo teamTodo){
        teamTodoRepository.save(teamTodo);
        return teamTodoRepository.findByteamId(teamTodo.getTeamId());
    }

}
