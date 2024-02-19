package hello.hellospring.service;

import hello.hellospring.dto.TeamMemoDTO;
import hello.hellospring.dto.TeamScheduleDTO;
import hello.hellospring.dto.TeamTodoDTO;
import hello.hellospring.model.*;
import hello.hellospring.repository.*;
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

    @Autowired
    TeamScheduleRepository teamScheduleRepository;

    public List<TeamTogether> getTeamList(String userId){
        return teamTogetherRepository.findByUserId(Long.valueOf(userId));
    }

    public List<TeamTogether> getUserList(String teamId){
        return teamTogetherRepository.findByTeamId(teamId);
    }

    @Transactional
    public List<TeamTogether> deleteUserFromTeam(String teamId, String userId){
        teamTogetherRepository.deleteByTeamIdAndUserId(teamId, Long.valueOf(userId));
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
        return teamTodoRepository.findByteamId(teamId);
    }

    @Transactional
    public List<TeamTodo> deleteTeamTodo(String teamId, String teamTodoId){
        teamTodoRepository.deleteByTeamIdAndTeamTodoId(teamId, Long.valueOf(teamTodoId));
        return getTeamTodo(teamTodoId);
    }

    public TeamTodo updateTeamTodo(TeamTodoDTO teamTodoDTO, String teamId, Long teamTodoId){

        TeamTodo originalTeamTodo = teamTodoRepository.findByTeamIdAndTeamTodoId(teamId, teamTodoId);
        originalTeamTodo.setTeamTodoTitle(teamTodoDTO.getTeamTodoTitle());
        originalTeamTodo.setTeamTodoDate(teamTodoDTO.getTeamTodoDate());
        originalTeamTodo.setTeamTodoDone(teamTodoDTO.isTeamTodoDone());
        originalTeamTodo.setTeamTodoColor(teamTodoDTO.getTeamTodoColor());

        teamTodoRepository.save(originalTeamTodo);

        return originalTeamTodo;
    }


    public List<TeamSchedule> inputScheduleInTeam(TeamSchedule teamSchedule){
        teamScheduleRepository.save(teamSchedule);
        return teamScheduleRepository.findByTeamId(teamSchedule.getTeamId());
    }

    public List<TeamSchedule> getSchedule(String teamId){
        return teamScheduleRepository.findByTeamId(teamId);
    }

    @Transactional
    public List<TeamSchedule> deleteSchedule(String teamId, Long todoId){
        teamScheduleRepository.deleteByTeamIdAndTodoId(teamId, todoId);
        return getSchedule(teamId);
    }

    public List<TeamMemo> getTeamMemo(String teamId){
        return teamMemoRepository.findByTeamId(teamId);
    }

    public List<TeamMemo> createTeamMemo(TeamMemo teamMemo){
        teamMemoRepository.save(teamMemo);
        return teamMemoRepository.findByTeamId(teamMemo.getTeamId());
    }

    public TeamMemo updateTeamMemo(TeamMemoDTO teamMemoDTO, String teamId, Long teamMemoId){
        TeamMemo originalTeamMemo = teamMemoRepository.findByTeamIdAndTeamMemoId(teamId, teamMemoId);
        originalTeamMemo.setMemoContent(teamMemoDTO.getMemoContent());
        teamMemoRepository.save(originalTeamMemo);

        return originalTeamMemo;
    }
}
