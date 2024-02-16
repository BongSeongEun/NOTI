package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team_together")
public class TeamTogether {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_together_id")
    private Long teamTogetherId;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "team_title")
    private String teamTitle;

    @Builder
    public TeamTogether(Long teamTogetherId, Long teamId, Long userId, String teamTitle){
        this.teamTogetherId = teamTogetherId;
        this.teamId = teamId;
        this.userId = userId;
        this.teamTitle = teamTitle;
    }
}
