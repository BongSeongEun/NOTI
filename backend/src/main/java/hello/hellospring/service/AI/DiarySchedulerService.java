package hello.hellospring.service.AI;

import hello.hellospring.model.Chat;
import hello.hellospring.model.User;
import hello.hellospring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DiarySchedulerService {
    private final TaskScheduler taskScheduler;
    private final UserRepository userRepository;
    private final GptDiaryService gptDiaryService;

    @Autowired
    public DiarySchedulerService(TaskScheduler taskScheduler,
                                 UserRepository userRepository,
                                 GptDiaryService gptDiaryService) {
        this.taskScheduler = taskScheduler;
        this.userRepository = userRepository;
        this.gptDiaryService = gptDiaryService;
        scheduleDiaryCreationTask();
    }

    private void checkUsersAndCreateDiaries() {
        ZoneId seoulZoneId = ZoneId.of("Asia/Seoul");
        ZonedDateTime nowSeoul = ZonedDateTime.now(seoulZoneId);

        LocalTime now = nowSeoul.toLocalTime();

        List<User> users = userRepository.findAll();
        users.forEach(user -> {
            String diaryTimeStr = user.getDiaryTime();
            if (diaryTimeStr == null) {
                // diaryTime이 null인 경우 예외 처리
                System.err.println("사용자 " + user.getUserId() + "의 diaryTime이 설정되지 않았습니다.");
                return;
            }
            try {
                LocalTime diaryTime = LocalTime.parse(diaryTimeStr, DateTimeFormatter.ofPattern("HH:mm"));
                if (diaryTime.equals(now.withSecond(0).withNano(0))) {
                    gptDiaryService.createDiary(user.getUserId());
                }
            } catch (Exception e) {
                System.err.println("사용자 " + user.getUserId() + "의 diaryTime 파싱 중 에러가 발생했습니다. diaryTime: " + diaryTimeStr);
            }
        });
    }

    private void scheduleDiaryCreationTask() {
        String cronExpression = "0 * * * * ?"; // 매 분마다 작업 실행, 실제 환경에서는 이 부분을 조절할 필요가 있습니다.
        taskScheduler.schedule(this::checkUsersAndCreateDiaries, new CronTrigger(cronExpression));
    }
}
