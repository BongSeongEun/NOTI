package hello.hellospring.repository;

import hello.hellospring.model.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> { // <해당 모델, 해당모델 pk의 타입>

    List<Diary> findByUserId (Long userId);
}
