package hello.hellospring.service;

import hello.hellospring.dto.TeamScheduleDTO;
import hello.hellospring.dto.TeamTodoDTO;
import hello.hellospring.model.Team;
import hello.hellospring.model.TeamSchedule;
import hello.hellospring.model.TeamTodo;
import hello.hellospring.model.TeamTogether;
import hello.hellospring.repository.TeamMemoRepository;
import hello.hellospring.repository.TeamRepository;
import hello.hellospring.repository.TeamTodoRepository;
import hello.hellospring.repository.TeamTogetherRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public List<TeamTogether> deleteUserFromTeam(String teamId, String userId){
        teamTogetherRepository.deleteByTeamIdAndUserId(Long.valueOf(teamId), Long.valueOf(userId));
        return getUserList(teamId);
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

    public List<TeamTodo> getTeamTodo(String teamId){
        return teamTodoRepository.findByteamId(Long.valueOf(teamId));
    }

    @Transactional
    public List<TeamTodo> deleteTeamTodo(String teamId, String teamTodoId){
        teamTodoRepository.deleteByTeamIdAndTeamTodoId(Long.valueOf(teamId), Long.valueOf(teamTodoId));
        return getTeamTodo(teamTodoId);
    }

    public TeamTodo updateTeamTodo(TeamTodoDTO teamTodoDTO, Long teamId, Long teamTodoId){

        TeamTodo originalTeamTodo = teamTodoRepository.findByTeamIdAndTeamTodoId(teamId, teamTodoId);
        originalTeamTodo.setTeamTodoTitle(teamTodoDTO.getTeamTodoTitle());
        originalTeamTodo.setTeamTodoDate(teamTodoDTO.getTeamTodoDate());
        originalTeamTodo.setTeamTodoDone(teamTodoDTO.isTeamTodoDone());
        originalTeamTodo.setTeamTodoColor(teamTodoDTO.getTeamTodoColor());

        teamTodoRepository.save(originalTeamTodo);

        return originalTeamTodo;
    }



}
