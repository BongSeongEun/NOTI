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

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "team_schedule_title")
    private String teamScheduleTitle;

    @Column(name = "team_schedule_date")
    private String teamScheduleDate;

    @Column(name = "team_schedule_color")
    private String teamScheduleColor;

    @Builder
    public TeamSchedule(Long teamScheduleId, Long teamId, Long userId, String teamScheduleTitle, String teamScheduleDate, String teamScheduleColor){
        this.teamScheduleId = teamScheduleId;
        this.teamId = teamId;
        this.userId = userId;
        this.teamScheduleTitle = teamScheduleTitle;
        this.teamScheduleDate = teamScheduleDate;
        this.teamScheduleColor = teamScheduleColor;
    }

}
