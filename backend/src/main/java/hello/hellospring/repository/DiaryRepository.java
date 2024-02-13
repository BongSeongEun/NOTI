package hello.hellospring.repository;

import hello.hellospring.model.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    static void deleteByDiaryId(Long diaryId) {
    }
    // <해당 모델, 해당모델 pk의 타입>

    List<Diary> findByUserId (Long userId);

    Optional<Object> findByUserIdAndDiaryId(Long userId, Long diaryId);


    void deleteByDiaryIdAndUserId(Long userId, Long diaryId);
}
