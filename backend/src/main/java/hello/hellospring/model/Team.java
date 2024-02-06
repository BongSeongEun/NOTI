package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "team_memo")
    private String teamMemo;

    @Builder
    public Team(Long teamId, String teamName, String teamMemo){
        this.teamId = teamId;
        this.teamName = teamName;
        this.teamMemo = teamMemo;
    }

}
