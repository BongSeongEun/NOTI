package hello.hellospring.dto;

import hello.hellospring.model.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamDTO {
    private Long teamId;
    private String teamTitle;
    private Long teamRandNum;

    public static Team toEntity(final TeamDTO dto){
        return Team.builder()
                .teamId(dto.getTeamId())
                .teamTitle(dto.getTeamTitle())
                .teamRandNum(dto.getTeamRandNum())
                .build();
    }

    public static TeamDTO from(Team team){
        return TeamDTO.builder()
                .teamId(team.getTeamId())
                .teamTitle(team.getTeamTitle())
                .teamRandNum(team.getTeamRandNum())
                .build();
    }

}
