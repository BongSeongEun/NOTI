package hello.hellospring.controller;

import hello.hellospring.dto.TeamDTO;
import hello.hellospring.dto.TeamTogetherDTO;
import hello.hellospring.model.Team;
import hello.hellospring.model.TeamTogether;
import hello.hellospring.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Random;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/")
public class TeamController {

    @Autowired
    TeamService teamService;

    @GetMapping("/getTeam/{userId}")
    public ResponseEntity<?> getTeam(@PathVariable String userId){
        List<TeamTogether> teamTogetherEntity = teamService.getTeamList(userId);
        List<TeamTogetherDTO> dtos = makeTeamTogetherDtoListFromEntityList(teamTogetherEntity);
        return ResponseEntity.ok().body(dtos);
    }

    @GetMapping("/getUserTeam/{teamId}")
    public ResponseEntity<?> getUserTeam(@PathVariable String teamId){
        List<TeamTogether> teamTogetherEntity = teamService.getUserList(teamId);
        List<TeamTogetherDTO> dtos = makeTeamTogetherDtoListFromEntityList(teamTogetherEntity);
        return ResponseEntity.ok().body(dtos);
    }

    @PostMapping("/enterTeam/{userId}")
    public ResponseEntity<?> enterTeam(@PathVariable String userId, @RequestBody TeamTogetherDTO teamTogetherDTO){
        TeamTogether entity = TeamTogetherDTO.toEntity(teamTogetherDTO);
        entity.setUserId(Long.valueOf(userId));
        List<TeamTogether> teamTogetherEntity = teamService.createTeam(entity);
        List<TeamTogetherDTO> dtos = makeTeamTogetherDtoListFromEntityList(teamTogetherEntity);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/createTeam")
    public ResponseEntity<?> createTeam(@RequestBody TeamDTO teamDTO){

        Random random = new Random();

        Team entity = TeamDTO.toEntity(teamDTO);
        entity.setTeamRandNum((long) random.nextInt(99999999));
        List<Team> teamEntity = teamService.createTeamTitle(entity);
        List<TeamDTO> dtos = makeTeamDtoListFromEntityList(teamEntity);
        return ResponseEntity.ok().build();
    }

//    @GetMapping("/getTeamTitle/{teamId}")
//    public ResponseEntity<?> getAllTeamTitle(@PathVariable String userId){
//
//    }

    private List<TeamDTO> makeTeamDtoListFromEntityList(List<Team> teamEntities){
        List<TeamDTO> teamDTOList = new ArrayList<>();

        for(Team teamEntity : teamEntities){
            TeamDTO teamDTO = TeamDTO.builder()
                    .teamId(teamEntity.getTeamId())
                    .teamTitle(teamEntity.getTeamTitle())
                    .teamRandNum(teamEntity.getTeamRandNum())
                    .build();
            teamDTOList.add(teamDTO);
        }
        return teamDTOList;
    }

    private List<TeamTogetherDTO> makeTeamTogetherDtoListFromEntityList(List<TeamTogether> teamTogetherEntities){
        List<TeamTogetherDTO> teamTogetherDTOList = new ArrayList<>();

        for(TeamTogether teamTogetherEntity : teamTogetherEntities){
            TeamTogetherDTO teamTogetherDTO = TeamTogetherDTO.builder()
                    .teamTogetherId(teamTogetherEntity.getTeamTogetherId())
                    .userId(teamTogetherEntity.getUserId())
                    .teamId(teamTogetherEntity.getTeamId())
                    .build();
            teamTogetherDTOList.add(teamTogetherDTO);
        }
        return teamTogetherDTOList;
    }

}
