package hello.hellospring.dto;

import hello.hellospring.model.TeamTogether;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamTogetherDTO {

    private Long teamTogetherId;
    private Long teamId;
    private Long userId;

    public static TeamTogether toEntity(final TeamTogetherDTO dto){
        return TeamTogether.builder()
                .teamTogetherId(dto.getTeamTogetherId())
                .userId(dto.getUserId())
                .teamId(dto.teamId)
                .build();
    }

    public static TeamTogetherDTO from(TeamTogether teamTogether){
        return TeamTogetherDTO.builder()
                .teamTogetherId(teamTogether.getTeamTogetherId())
                .teamId(teamTogether.getTeamId())
                .userId(teamTogether.getUserId())
                .build();
    }

}
