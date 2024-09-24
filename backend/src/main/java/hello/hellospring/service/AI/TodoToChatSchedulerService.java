package hello.hellospring.service.AI;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import hello.hellospring.Oauth.OauthToken;
import hello.hellospring.model.Chat;
import hello.hellospring.model.Todo;
import hello.hellospring.model.User;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    private final UserRepository userRepository;
    private ScheduledFuture<?> scheduledFuture;
    private static final Logger logger = LoggerFactory.getLogger(TodoToChatSchedulerService.class);

    private final Environment environment;

    public void someMethod() {
        String clientId = environment.getProperty("google.client.id");
        System.out.println(clientId);
    }
    public void someMethod2() {
        String clientSecret = environment.getProperty("google.refresh.token");
        System.out.println(clientSecret);
    }
    public void someMethod3() {
        String refreshToken = environment.getProperty("google.client.secret");
        System.out.println(refreshToken);
    }
    @Value("${google.client.id}")
    private String CLIENT_ID;

    @Value("${google.refresh.token}")
    private String REFRESH_TOKEN;

    @Value("${google.client.secret}")
    private String CLIENT_SECRET;

    private String refreshToken = REFRESH_TOKEN;

    public String accessToken = "ya29.a0Ad52N39xQkqvEFgAYIyr6mVZtBWqhOFcginiIQGRmn-aJRU-4kJp6_qFSbhXIqU5xlpI5r_NDgqat_ecXhm9WjT2HuIjcbbSzx9ZeXtw2rfp0hXjjPps2zFQ8qJTz4-ybg1Zvg75eqfGRG1YUbp2A_CD4eQp2A8xE4UkFwaCgYKAbISARASFQHGX2MiF-h6y9Tz-ooHZBXLmNcEYw0173";

    @Autowired
    public TodoToChatSchedulerService(TaskScheduler taskScheduler, TodoRepository todoRepository, ChatRepository chatRepository, UserRepository userRepository, Environment environment) {
        this.taskScheduler = taskScheduler;
        this.todoRepository = todoRepository;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.environment = environment;

        logger.info("Loaded CLIENT_ID: {}", CLIENT_ID);
        logger.info("Loaded CLIENT_SECRET: {}", CLIENT_SECRET);
        logger.info("Loaded REFRESH_TOKEN: {}", REFRESH_TOKEN);
        scheduleTask();
        getGoogleAccessToken();
        scheduleTokenRefresh();
    }

    public String getCalendarAccessToken(){
        return accessToken;
    }

    public String getGoogleAccessToken(){

        String clientId = environment.getProperty("google.client.id");
        String clientSecret = environment.getProperty("google.client.secret");
//        String refreshToken = environment.getProperty("google.refresh.token");
        String type = "refresh_token";
        logger.info("Loaded CLIENT_ID: {}", clientId);
        logger.info("Loaded CLIENT_SECRET: {}", clientSecret);
        logger.info("Loaded REFRESH_TOKEN: {}", refreshToken);
        logger.info("Loaded GRANT_TYPE: {}", type);

        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", type);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("refresh_token", refreshToken);
        logger.info("Loaded param: {}", params);



        HttpEntity<MultiValueMap<String, String>> GoogleTokenRequest =
                new HttpEntity<>(params, headers);

        ResponseEntity<String> accessTokenResponse = rt.exchange(
                "https://oauth2.googleapis.com/token",
                HttpMethod.POST,
                GoogleTokenRequest,
                String.class
        );

        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(accessTokenResponse.getBody(), OauthToken.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        accessToken = oauthToken.getAccess_token();
        refreshToken = oauthToken.getRefresh_token();
        logger.info("Loaded ACCESS_TOKEN: {}", accessToken);
        return accessToken;
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
            chat.setChatContent(todo.getTodoTitle() + "을(를) 달성하셨나요?");
            chat.setChatWho(true);
            chat.setTodoFinishAsk(true);
            chat.setTodoFinishAns(false);
            chatRepository.save(chat);

            String body = chat.getChatContent();
            User user =
                    userRepository.findByUserId(todo.getUserId());
            String token = user.getDeviceToken();
            Long todoId = todo.getTodoId();
            Long userId = user.getUserId();

            String jsonRequest = "{\n" +
                    "    \"message\": {\n" +
                    "        \"token\": \"" + token + "\",\n" +
                    "        \"data\": {\n" +
                    "          \"body\": \"" + body + "\",\n" +
                    "          \"title\": \"노티\", \n" +
                    "          \"action\": \"YES_OR_NO\", \n" +
                    "          \"todoId\": \"" + todoId + "\",\n" + 
                    "          \"userId\": \"" + userId + "\"\n" +
                    "        }\n" +
                    "    }\n" +
                    "}";
        
            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.add("Authorization", "Bearer " + accessToken);
            
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

    private void scheduleTokenRefresh(){
        String cronExpression = "0 0 * * * ?";
        scheduledFuture = taskScheduler.schedule(this::getGoogleAccessToken, new CronTrigger(cronExpression));
    }
}
