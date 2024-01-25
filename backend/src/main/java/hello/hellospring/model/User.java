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

    @Column(name = "kakao_id")
    private Long kakaoId;

    @Column(name = "user_profile")
    private String userProfile;

    @Column(name = "user_nickname")
    private String userNickname;

    @Column(name = "user_color")
    private String userColor;

    @Column(name = "user_role")
    private String userRole;

    @Builder
    public User(Long userId, Long kakaoId, String userProfile, String userNickname,
                String userColor, String userRole) {

        this.userId = userId;
        this.kakaoId = kakaoId;
        this.userProfile = userProfile;
        this.userNickname = userNickname;
        this.userColor = userColor;
        this.userRole = userRole;
    }
}