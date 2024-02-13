package hello.hellospring.controller;

import hello.hellospring.dto.TeamTogetherDTO;
import hello.hellospring.model.TeamTogether;
import hello.hellospring.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        List<TeamTogetherDTO> dtos = makeDtoListFromEntityList(teamTogetherEntity);
        return ResponseEntity.ok().body(dtos);
    }

    @GetMapping("/getUserTeam/{teamId}")
    public ResponseEntity<?> getUserTeam(@PathVariable String teamId){
        List<TeamTogether> teamTogetherEntity = teamService.getUserList(teamId);
        List<TeamTogetherDTO> dtos = makeDtoListFromEntityList(teamTogetherEntity);
        return ResponseEntity.ok().body(dtos);
    }

    private List<TeamTogetherDTO> makeDtoListFromEntityList(List<TeamTogether> teamTogetherEntities){
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
