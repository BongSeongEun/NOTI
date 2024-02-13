package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "team_title")
    private String teamTitle;

    @Column(name = "team_randnum")
    private Long teamRandNum;

    @Builder
    public Team(Long teamId, String teamTitle, Long teamRandNum){
        this.teamId = teamId;
        this.teamTitle = teamTitle;
        this.teamRandNum = teamRandNum;
    }


}
