package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team_memo")
public class Team_memo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_memo_id")
    private Long teamMemoId;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "memo_content")
    private String memoContent;

    @Column(name = "memo_title")
    private String memoTitle;

    @Builder
    public Team_memo(Long teamMemoId, Long teamId, String memoContent, String memoTitle){
        this.teamMemoId = teamMemoId;
        this.teamId = teamId;
        this.memoContent = memoContent;
        this.memoTitle = memoTitle;
    }
}
