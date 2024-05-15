package hello.hellospring.repository;

import hello.hellospring.model.Goal;
import hello.hellospring.model.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {
}
