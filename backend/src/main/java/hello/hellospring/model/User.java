package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kakao_id")
    private Kakao kakaoId;

    @Column(name = "user_profile")
    private String userProfile;

    @Column(name = "user_nickname")
    private String userNickname;

    @Column(name = "user_color")
    private String userColor;

    @Column(name = "mute_start_time")
    private String muteStartTime;

    @Column(name = "mute_end_time")
    private String muteEndTime;

    @Column(name = "diary_time")
    private String diaryTime;

    @Builder
    public User(Long userId, Kakao kakaoId, String userProfile, String userNickname,
                String userColor, String muteStartTime, String muteEndTime, String diaryTime) {

        this.userId = userId;
        this.kakaoId = kakaoId;
        this.userProfile = userProfile;
        this.userNickname = userNickname;
        this.userColor = userColor;
        this.muteStartTime = muteStartTime;
        this.muteEndTime = muteEndTime;
        this.diaryTime = diaryTime;
    }
}