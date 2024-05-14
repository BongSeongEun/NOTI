package hello.hellospring.dto;

import hello.hellospring.model.User;
import lombok.Data;

@Data
public class UserDTO {

    private Long kakaoId;
    private Long userId;
    private String kakaoEmail;
    private String userProfile;
    private String userNickname;
    private String userColor;
    private String muteStartTime;
    private String muteEndTime;
    private String diaryTime;
    private String deviceToken;

    public User toEntity(){
        return User.builder()
                .kakaoId(kakaoId)
                .userId(userId)
                .kakaoEmail(kakaoEmail)
                .userProfile(userProfile)
                .userNickname(userNickname)
                .userColor(userColor)
                .muteStartTime(muteStartTime)
                .muteEndTime(muteEndTime)
                .diaryTime(diaryTime)
                .deviceToken(deviceToken)
                .build();
    }
}
