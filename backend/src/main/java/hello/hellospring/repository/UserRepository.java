package hello.hellospring.repository;

import hello.hellospring.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public User findByKakaoEmail(String kakaoEmail);
    public User findByUserId(Long userId);
}
