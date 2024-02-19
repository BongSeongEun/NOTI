package hello.hellospring.service.AI;

import hello.hellospring.model.User;
import hello.hellospring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

@Service
public class DiarySchedulerService {
    private final TaskScheduler taskScheduler; //동적스케줄링
    private final UserRepository userRepository; //USER
    private final GptDiaryService gptDiaryService; //CHAT
    private final Map<Long, ScheduledFuture<?>> scheduledTasks = new HashMap<>();


    @Autowired
    public DiarySchedulerService(TaskScheduler taskScheduler,
                                 UserRepository userRepository,
                                 GptDiaryService gptDiaryService) {
        this.taskScheduler = taskScheduler;
        this.userRepository = userRepository;
        this.gptDiaryService = gptDiaryService;
        initializeScheduledTasks(); // 서비스 생성시, 모든 사용자에 대한 일기생성작업 초기화
    }


    // 특정 사용자의 일기 생성 작업을 스케줄링하거나, 이미 존재하는 작업을 업데이트
    public void scheduleOrUpdateDiaryTask(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        String diaryTimeString = user.getDiaryTime(); // 사용자별 일기 생성시간 조회
        if (diaryTimeString != null && !diaryTimeString.isEmpty()) {
            try {
                LocalTime diaryTime = LocalTime.parse(diaryTimeString, DateTimeFormatter.ofPattern("HH:mm"));
                String cron = String.format("%d %d %d * * ?", diaryTime.getSecond(), diaryTime.getMinute(), diaryTime.getHour());
                ScheduledFuture<?> scheduledTask = scheduledTasks.get(userId);
                if (scheduledTask != null && !scheduledTask.isDone()) {
                    scheduledTask.cancel(false);
                }
                scheduledTask = taskScheduler.schedule(() -> {
                    try {
                        gptDiaryService.createDiary(userId);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }, new CronTrigger(cron));
                scheduledTasks.put(userId, scheduledTask);
            } catch (DateTimeParseException e) {
                // 유효하지 않은 시간 형식을 처리하거나 로깅
                System.err.println("잘못된 형태로 diaryTime으로 들어갔어요... ㅡ3ㅡ " + userId + ": " + diaryTimeString);
            }
        } else {
            // diaryTime이 비어 있는 경우의 처리
            System.err.println("이 분은 diaryTime을 설정하지 않으셨어요.... :( " + userId);
        }
    }
    private void initializeScheduledTasks() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            scheduleOrUpdateDiaryTask(user.getUserId());
        }
    }
}
