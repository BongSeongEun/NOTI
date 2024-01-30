package hello.hellospring.dto;

import hello.hellospring.model.User;
import lombok.Data;

@Data
public class UserDTO {

    private Long kakaoId;
    private Long userId;
    private String userProfile;
    private String userNickname;
    private String userColor;
    private Long muteStartTime;
    private Long muteEndTime;
    private Long diaryTime;

    public User toEntity(){
        return User.builder()
                .kakaoId(kakaoId)
                .userId(userId)
                .userProfile(userProfile)
                .userNickname(userNickname)
                .userColor(userColor)
                .muteStartTime(muteStartTime)
                .muteEndTime(muteEndTime)
                .diaryTime(diaryTime)
                .build();
    }
}
