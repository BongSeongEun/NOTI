package hello.hellospring.repository;

import hello.hellospring.model.Kakao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KakaoRepository extends JpaRepository<Kakao, Long> {
    public Kakao findByKakaoEmail(String kakaoEmail);
    public Kakao findByUserId(Long userId);
}
