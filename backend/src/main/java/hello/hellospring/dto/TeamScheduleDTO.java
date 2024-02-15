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
    private Long todoId;

    public static TeamSchedule toEntity(final TeamScheduleDTO dto){
        return TeamSchedule.builder()
                .teamScheduleId(dto.getTeamScheduleId())
                .teamId(dto.getTeamId())
                .todoId(dto.getTodoId())
                .build();
    }

    public static TeamScheduleDTO from (TeamSchedule teamSchedule){
        return TeamScheduleDTO.builder()
                .teamScheduleId(teamSchedule.getTeamScheduleId())
                .teamId(teamSchedule.getTeamId())
                .todoId(teamSchedule.getTodoId())
                .build();
    }

}
