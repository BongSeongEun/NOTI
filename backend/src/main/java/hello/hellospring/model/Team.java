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

    @Column(name = "team_title")
    private String teamTitle;

    @Builder
    public Team(Long teamId, String teamTitle){
        this.teamId = teamId;
        this.teamTitle = teamTitle;
    }

}
