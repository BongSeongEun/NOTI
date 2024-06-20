package hello.hellospring.repository;

import hello.hellospring.model.Goal;
import hello.hellospring.model.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {
    // userId와 summaryStatsDate가 일치하는 데이터
    @Query("SELECT s FROM Summary s WHERE s.userId = :userId AND s.summaryStatsDate = :summaryStatsDate")
    List<Summary> findByUserIdAndSummaryStatsDate(
            @Param("userId") Long userId,
            @Param("summaryStatsDate") String summaryStatsDate);

}
