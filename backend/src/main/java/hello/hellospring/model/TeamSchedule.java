package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team_schedule")
public class TeamSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_schedule_id")
    private Long teamScheduleId;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "todo_id")
    private Long todoId;

    @Builder
    public TeamSchedule(Long teamScheduleId, Long teamId, Long todoId){
        this.teamScheduleId = teamScheduleId;
        this.teamId = teamId;
        this.todoId = todoId;
    }

}
