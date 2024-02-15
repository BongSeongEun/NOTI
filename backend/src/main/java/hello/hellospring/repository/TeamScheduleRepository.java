package hello.hellospring.repository;

import hello.hellospring.model.TeamSchedule;
import java.util.List;

public interface TeamScheduleRepository {
    List<TeamSchedule> findByteamId(Long teamId);
    List<TeamSchedule> findByuserId(Long userId);
    TeamSchedule findByTeamIdAndUserId(Long teamId, Long userId);
}
