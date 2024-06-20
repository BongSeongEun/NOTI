package hello.hellospring.repository;

import hello.hellospring.model.Diary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    List<Diary> findByUserIdAndDiaryDate(Long userId, String diaryDate);

    Page<Diary> findByUserId(Long userId, Pageable pageable); // 페이징처리

    @Query("SELECT d FROM Diary d WHERE d.userId = :userId AND SUBSTRING(d.diaryDate, 1, 7) = :emotionDate")
    List<Diary> findByUserIdAndEmotionDate(@Param("userId")Long userId,
                                           @Param("emotionDate")String emotionDate);
}
