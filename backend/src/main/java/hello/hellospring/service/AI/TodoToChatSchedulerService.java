package hello.hellospring.service.AI;


import hello.hellospring.model.Chat;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

import java.net.http.HttpRequest;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ScheduledFuture;

@Service
public class TodoToChatSchedulerService { // todoEndTime에 해당하는 시간이 되면 자동으로 gpt가 물어보게 하기
    private final TaskScheduler taskScheduler;
    private final TodoRepository todoRepository;
    private final ChatRepository chatRepository;
    private ScheduledFuture<?> scheduledFuture;

    @Autowired
    public TodoToChatSchedulerService(TaskScheduler taskScheduler, TodoRepository todoRepository, ChatRepository chatRepository) {
        this.taskScheduler = taskScheduler;
        this.todoRepository = todoRepository;
        this.chatRepository = chatRepository;
        scheduleTask();
    }
    private void checkTodosAndCreateChat() {
        ZoneId seoulZoneId = ZoneId.of("Asia/Seoul");
        ZonedDateTime nowSeoul = ZonedDateTime.now(seoulZoneId);

        LocalDate today = nowSeoul.toLocalDate();
        LocalTime now = nowSeoul.toLocalTime();
        
        List<Todo> todos =
                todoRepository.findByTodoDateAndTodoEndTimeAndTodoDoneIsFalse(
                        today.format(DateTimeFormatter.ofPattern("yyyy.MM.dd")),
                        now.format(DateTimeFormatter.ofPattern("HH:mm")));

        todos.forEach(todo -> {
            if (todo.isTodoDone()) {
                return;
            }

            Chat chat = new Chat();
            chat.setUserId(todo.getUserId());
            chat.setChatContent(todo.getTodoTitle() + "를 달성하셨나요?");
            chat.setChatWho(true);
            chat.setTodoFinishAsk(true);
            chat.setTodoFinishAns(false);
            chatRepository.save(chat);

            String body = chat.getChatContent();

            String jsonRequest = "{\n" +
            "    \"message\": {\n" +
            "        \"token\": \"e1M8MFyBRbe_tMIkQeKOVf:APA91bHMn2FYfFNqbNJcLDA_ctnK5jlrCAn-ITCOp-JYiEv-LmoL-1VesZbuO36DtACKLh-SSY-WzbfCVwWC9cru2Ubu4neNt_QUcG1ZPCR4_b9wWvff64yq0yflfKyWWblT_j7d1Bmo\",\n" +
            "        \"data\": {\n" +
            "          \"body\": \"" + body + "\",\n" +
            "          \"title\": \"노티\"\n" +
            "          \"action\": \"YES_OR_NO\"\n" +
            "        }\n" +
            "    }\n" +
            "}";
        
            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.add("Authorization", "Bearer ya29.a0Ad52N3_whivUEplHjHQwExsYAT9uxMJK8K1dUL4Zk-wl-DmafFRt9V05v5BhpGGvpLyUbAjuvx6ztHQ4mRexIWesBpBQUh2wjgb6Uo96pm8ZUyGsryOlGVWIp7TpFnpby_CT-c3kVf60divEgDCrOtRly0yObTnCO0ZfaCgYKAc4SARASFQHGX2MiPItkuFIh8d6S173PlG93Wg0171");
            
            HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);
            
            ResponseEntity<String> response = rt.exchange(
                    "https://fcm.googleapis.com/v1/projects/noti-619c1/messages:send",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

        });
    }

    private void scheduleTask() {
        String cronExpression = "0 * * * * ?"; // 매 분마다 작업 실행
        scheduledFuture = taskScheduler.schedule(this::checkTodosAndCreateChat, new CronTrigger(cronExpression));
    }
}
