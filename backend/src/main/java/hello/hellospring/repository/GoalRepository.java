package hello.hellospring.repository;

import hello.hellospring.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    // userId와 date가 일치하는 데이터들 조회
    @Query("SELECT t FROM Goal t WHERE t.userId = :userId AND t.goalDate = :statsDate")
    List<Goal> findByUserIdAndStatsDate(
            @Param("userId") Long userId,
            @Param("statsDate") String statsDate);

    // 일치하는 데이터 삭제
    void deleteByUserIdAndGoalDate(Long userId, String goalDate);

    // 일치하는 데이터 있는지 조회
    boolean existsByUserIdAndGoalDate(Long userId, String goalDate);
}
