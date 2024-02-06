package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team_time")
public class Team_time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_time_id")
    private Long teamTimeId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "todo_id")
    private Long todoId;

    @Builder
    public Team_time(Long userId, Long teamId, Long todoId){
        this.userId = userId;
        this.teamId = teamId;
        this.todoId = todoId;
    }

}
