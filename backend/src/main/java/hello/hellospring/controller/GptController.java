package hello.hellospring.controller;

import hello.hellospring.dto.ChatDTO;
import hello.hellospring.model.Chat;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.AI.GptDiaryService;
import hello.hellospring.service.AI.GptService;
import hello.hellospring.service.AI.GptTodoService;
import hello.hellospring.service.AI.NlpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class GptController {

    private final GptService gptService; //service 참조
    private final GptDiaryService gptDiaryService; // service 참조2
    private final ChatRepository chatRepository; // repository 참조
    private final GptTodoService gptTodoService; // todo인지 아닌지 분류
    private final NlpService nlpService; // nlp기능 사용
    private final TodoRepository todoRepository; // todo 저장용



    @Autowired
    public GptController(GptService gptService, ChatRepository chatRepository, GptDiaryService gptDiaryService, GptTodoService gptTodoService, NlpService nlpService, TodoRepository todoRepository) {

        this.gptService = gptService;
        this.chatRepository = chatRepository;
        this.gptDiaryService = gptDiaryService;
        this.gptTodoService = gptTodoService;
        this.nlpService = nlpService;
        this.todoRepository = todoRepository;
    }

    @PostMapping("/api/v3/ask/{userId}") //채팅보내기 및 gpt답변호출
    public String ask(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        //Long userId = Long.parseLong(request.get("user_id")); // userId 입력받음
        String userMessage = request.get("chatContent"); // chat_content 입력받음
        //boolean chatRole = Boolean.parseBoolean(request.get("chat_role")); // chat_role 입력받음

        try {
            boolean gptTodo = Boolean.parseBoolean(gptTodoService.askGpt(userMessage, userId));
            String chatEvent = null;

            // gptTodo가 true일 경우, nlpService 호출
            String nlpEvent = null;
            String nlpTime = null;

            if (gptTodo) { // 합쳐져 있는 event와 time을 각각 분리
                chatEvent = nlpService.askNlp(userMessage, userId);

                // 정규 표현식 패턴: 대괄호 안의 쌍따옴표 또는 작은따옴표로 둘러싸인 문자열을 찾음
                Pattern pattern = Pattern.compile("\\[((?:\"|')(.*?)(?:\"|'))\\]");
                Matcher matcher = pattern.matcher(chatEvent);
                nlpEvent = null;
                nlpTime = null;

                // event값 분류하기 (첫 번째 일치하는 부분 찾기)
                if (matcher.find()) {
                    nlpEvent = matcher.group(2); // 두 번째 괄호에 일치하는 부분 (쌍따옴표 또는 작은따옴표 내의 문자열)
                }
                // time값 분류하기  (두 번째 일치하는 부분 찾기)
                if (matcher.find()) {
                    nlpTime = matcher.group(2); // 다음 두 번째 괄호에 일치하는 부분
                }
            }


            // 첫 번째 Chat 엔티티를 생성하고 데이터베이스에 저장 (클라이언트가 보낸 메시지)
            ChatDTO initialChatDTO = new ChatDTO(null, userId, null, userMessage, false, gptTodo, nlpEvent, nlpTime);
            Chat initialChat = Chat.toSaveEntity(initialChatDTO);
            chatRepository.save(initialChat);

            if (nlpTime != null && nlpEvent != null) {
                // nlpTime 문자열 분리
                String[] times = nlpTime.split("~");
                if (times.length == 2) { // 정상적으로 두 부분으로 분리되었는지 확인
                    String startTimeStr = times[0];
                    String endTimeStr = times[1];

                    // nlpEvent과 nlpTime을 Todo 테이블에 저장
                    Todo newTodo = new Todo();
                    newTodo.setUserId(userId); // userId 값 저장
                    newTodo.setTodoTitle(nlpEvent); // nlpEvent 값 저장

                    // 여기서는 시간 정보를 String으로 다루고 있으므로, LocalTime을 다시 문자열로 변환
                    newTodo.setTodoStartTime(startTimeStr.toString()); // 시작 시간 저장
                    newTodo.setTodoEndTime(endTimeStr.toString()); // 종료 시간 저장

                    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
                    String formattedDate = LocalDate.now().format(dateFormatter); // 현재 날짜를 "yyyy.MM.dd" 형식으로 포맷팅
                    newTodo.setTodoDate(formattedDate); // 포맷팅된 날짜를 todoDate에 저장

                    newTodo.setTodoDone(false);
                    newTodo.setTodoColor("color1");

                    todoRepository.save(newTodo); // Todo 저장
                } else {
                    // nlpTime 형식이 예상과 다를 경우의 처리
                    System.out.println("nlpTime 형식이 유효하지 않습니다: " + nlpTime);
                }
            }


        } catch (Exception e){
            e.printStackTrace();
            return "GPT API 호출 오류가 발생했어요...ㅠ3ㅠ 아마.. API KEY가 잘못입력된 것 같아요..!!";
        }

        try {
            // GPT 서비스를 호출하여 응답 받기
            String gptResponse = gptService.askGpt(userMessage, userId);

            // GPT 응답을 새로운 Chat 엔티티의 chat_content로 설정하고 데이터베이스에 저장
            ChatDTO responseChatDTO = new ChatDTO(null, userId, null, gptResponse, true, false, null, null);
            Chat responseChat = Chat.toSaveEntity(responseChatDTO);
            chatRepository.save(responseChat);

            // GPT 응답을 클라이언트에 반환
            return gptResponse;

        } catch (Exception e) {
            e.printStackTrace();
            return "GPT API 호출 오류가 발생했어요...ㅠ3ㅠ 아마.. API KEY가 잘못입력된 것 같아요..!!";
        }
    }

    @GetMapping("/api/v3/chatlist/{userId}") // 채팅내역 가져오기
    public List<Chat> getChatListByUserId(@PathVariable Long userId) {

        return chatRepository.findByUserId(userId);
    }

    @GetMapping("/api/v3/createDiary/{userId}") // 일기생성하기
    public String createDiary(@PathVariable Long userId){
        try {
            // userId에 해당하는 chatContent들로 일기 생성
            return gptDiaryService.createDiary(userId);
        } catch (Exception e){
            e.printStackTrace();
            return "일기 생성 중 오류가 발생했어요... :(";
        }

    }


}
