package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team_memo")
public class TeamMemo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_memo_id")
    private Long teamMemoId;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "memo_content")
    private String memoContent;

    @Builder
    public TeamMemo(Long teamMemoId, Long teamId, String memoContent){
        this.teamMemoId = teamMemoId;
        this.teamId = teamId;
        this.memoContent = memoContent;
    }
}
