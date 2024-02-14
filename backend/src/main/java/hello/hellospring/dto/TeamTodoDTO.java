package hello.hellospring.dto;

import hello.hellospring.model.TeamTodo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamTodoDTO {
    private Long teamTodoId;
    private Long teamId;
    private boolean teamTodoDone;
    private String teamTodoTitle;
    private String teamTodoDate;
    private String teamTodoColor;

    public static TeamTodo toEntity(final TeamTodoDTO dto){
        return TeamTodo.builder()
                .teamTodoId(dto.getTeamTodoId())
                .teamId(dto.getTeamId())
                .teamTodoDone(dto.isTeamTodoDone())
                .teamTodoTitle(dto.getTeamTodoTitle())
                .teamTodoDate(dto.getTeamTodoDate())
                .teamTodoColor(dto.getTeamTodoColor())
                .build();
    }

    public static TeamTodoDTO from(TeamTodo teamTodo){
        return TeamTodoDTO.builder()
                .teamTodoId(teamTodo.getTeamTodoId())
                .teamId(teamTodo.getTeamId())
                .teamTodoDone(teamTodo.isTeamTodoDone())
                .teamTodoTitle(teamTodo.getTeamTodoTitle())
                .teamTodoDate(teamTodo.getTeamTodoDate())
                .teamTodoColor(teamTodo.getTeamTodoColor())
                .build();
    }

}
