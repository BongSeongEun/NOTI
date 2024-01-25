package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "time")
public class Time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "time_id")
    private Long timeId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "mute_start_time")
    private Long muteStartTime;

    @Column(name = "mute_end_time")
    private Long muteEndTime;

    @Column(name = "diary_time")
    private Long diarytime;

    @Builder
    public Time(Long userId, Long muteStartTime, Long muteEndTime, Long diarytime){
        this.userId = userId;
        this.muteStartTime = muteStartTime;
        this.muteEndTime = muteEndTime;
        this.diarytime = diarytime;
    }

}
