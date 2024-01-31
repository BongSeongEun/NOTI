package hello.hellospring.dto;

import hello.hellospring.model.Kakao;
import hello.hellospring.model.User;
import lombok.Data;

@Data
public class UserDTO {

    private Kakao kakaoId;
    private Long userId;
    private String userProfile;
    private String userNickname;
    private String userColor;
    private String muteStartTime;
    private String muteEndTime;
    private String diaryTime;

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
