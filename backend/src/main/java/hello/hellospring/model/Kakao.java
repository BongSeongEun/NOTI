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

    @Builder
    public Kakao(Long KakaoId, String kakaoEmail, String kakaoProfileImg){
        this.kakaoId = kakaoId;
        this.kakaoEmail = kakaoEmail;
        this.kakaoProfileImg = kakaoProfileImg;
    }
}
