package hello.hellospring.dto;

import hello.hellospring.model.TeamMemo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMemoDTO {

    private Long teamMemoId;
    private Long teamId;
    private String memoContent;

    public static TeamMemo toEntity(final TeamMemoDTO dto){
        return TeamMemo.builder()
                .teamMemoId(dto.getTeamMemoId())
                .teamId(dto.getTeamId())
                .memoContent(dto.getMemoContent())
                .build();
    }
    public static TeamMemoDTO from(TeamMemo teamMemo){
        return TeamMemoDTO.builder()
                .teamMemoId(teamMemo.getTeamMemoId())
                .teamId(teamMemo.getTeamId())
                .memoContent(teamMemo.getMemoContent())
                .build();
    }

}
