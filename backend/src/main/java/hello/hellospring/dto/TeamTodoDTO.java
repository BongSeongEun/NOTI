package hello.hellospring.dto;

import hello.hellospring.model.TeamTodo;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private Long userId;
    private boolean teamTodoDone;
    private String teamTodoTitle;
    private String teamTodoDate;

    public static TeamTodo toEntity(final TeamTodoDTO dto){
        return TeamTodo.builder()
                .teamTodoId(dto.getTeamTodoId())
                .teamId(dto.getTeamId())
                .userId(dto.getUserId())
                .teamTodoDone(dto.isTeamTodoDone())
                .teamTodoTitle(dto.getTeamTodoTitle())
                .teamTodoDate(dto.getTeamTodoDate())
                .build();
    }

    public static TeamTodoDTO from(TeamTodo teamTodo){
        return TeamTodoDTO.builder()
                .teamTodoId(teamTodo.getTeamTodoId())
                .teamId(teamTodo.getTeamId())
                .userId(teamTodo.getUserId())
                .teamTodoDone(teamTodo.isTeamTodoDone())
                .teamTodoTitle(teamTodo.getTeamTodoTitle())
                .teamTodoDate(teamTodo.getTeamTodoDate())
                .build();
    }

}
