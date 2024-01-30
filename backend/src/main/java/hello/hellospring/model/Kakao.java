package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "kakao")
public class Kakao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kakao_id")
    private Long kakaoId;

    @Column(name = "kakao_email")
    private String kakaoEmail;

    @Column(name = "kakao_profile_img")
    private String kakaoProfileImg;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "kakao_nickname")
    private String kakaoNickname;

    @Builder
    public Kakao(Long kakaoId, String kakaoEmail, String kakaoProfileImg, Long userId, String kakaoNickname){
        this.userId = userId;
        this.kakaoId = kakaoId;
        this.kakaoEmail = kakaoEmail;
        this.kakaoProfileImg = kakaoProfileImg;
        this.kakaoNickname = kakaoNickname;
    }
}
