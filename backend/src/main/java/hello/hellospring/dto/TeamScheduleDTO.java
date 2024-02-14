package hello.hellospring.dto;

import hello.hellospring.model.TeamSchedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamScheduleDTO {
    private Long teamScheduleId;
    private Long teamId;
    private Long userId;
    private String teamScheduleTitle;
    private String teamScheduleDate;
    private String teamScheduleColor;

    public static TeamScheduleDTO toEntity(final TeamScheduleDTO dto){
        return TeamScheduleDTO.builder()
                .teamScheduleId(dto.getTeamScheduleId())
                .teamId(dto.getTeamId())
                .userId(dto.getUserId())
                .teamScheduleTitle(dto.getTeamScheduleTitle())
                .teamScheduleDate(dto.getTeamScheduleDate())
                .teamScheduleColor(dto.getTeamScheduleColor())
                .build();
    }

    public static TeamScheduleDTO from (TeamSchedule teamSchedule){
        return TeamScheduleDTO.builder()
                .teamScheduleId(teamSchedule.getTeamScheduleId())
                .teamId(teamSchedule.getTeamId())
                .userId(teamSchedule.getUserId())
                .teamScheduleTitle(teamSchedule.getTeamScheduleTitle())
                .teamScheduleDate(teamSchedule.getTeamScheduleDate())
                .teamScheduleColor(teamSchedule.getTeamScheduleColor())
                .build();
    }

}
