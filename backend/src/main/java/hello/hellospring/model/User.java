package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "kakao_id")
    private Long kakaoId;

    @Column(name = "kakao_email")
    private String kakaoEmail;

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

    @Column(name = "device_token")
    private String deviceToken;

    @Builder
    public User(Long userId, Long kakaoId, String kakaoEmail, String userProfile, String userNickname,
                String userColor, String muteStartTime, String muteEndTime, String diaryTime, String deviceToken) {

        this.userId = userId;
        this.kakaoId = kakaoId;
        this.kakaoEmail = kakaoEmail;
        this.userProfile = userProfile;
        this.userNickname = userNickname;
        this.userColor = userColor;
        this.muteStartTime = muteStartTime;
        this.muteEndTime = muteEndTime;
        this.diaryTime = diaryTime;
        this.deviceToken = deviceToken;
    }
    public void updateUserInfo(String userNickname, String userProfile, String userColor, String muteStartTime, String muteEndTime, String diaryTime, String deviceToken) {
        if(userNickname != null) this.userNickname = userNickname;
        if(userProfile != null) this.userProfile = userProfile;
        if(userColor != null) this.userColor = userColor;
        if(muteStartTime != null) this.muteStartTime = muteStartTime;
        if(muteEndTime != null) this.muteEndTime = muteEndTime;
        if(diaryTime != null) this.diaryTime = diaryTime;
        if(deviceToken != null) this.deviceToken = deviceToken;
    }

}