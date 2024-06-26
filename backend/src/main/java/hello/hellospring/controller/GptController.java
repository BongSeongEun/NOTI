package hello.hellospring.controller;

import hello.hellospring.dto.ChatDTO;
import hello.hellospring.model.Chat;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.AI.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
public class GptController {

    private final GptService gptService; //service 참조
    private final GptDiaryService gptDiaryService; // service 참조2
    private final ChatRepository chatRepository; // repository 참조
    private final GptTodoService gptTodoService; // todo인지 아닌지 분류
    private final NlpService nlpService; // nlp기능 사용
    private final TodoRepository todoRepository; // todo 저장용
    private final GptFinishService gptFinishService; // 이제 대답용 메시지인지
    private final GptFinishNlpService gptFinishNlpService; // todo 완료용 대답 nlp 분류
    private final GptCompareTodo gptCompareTodo; // todo 완료용을 title과 비교
    private final NlpCompareTodoService nlpCompareTodoService; // todo 리스트 핵심 키워드 추출

    @Autowired
    public GptController(GptService gptService,
                         ChatRepository chatRepository,
                         GptDiaryService gptDiaryService,
                         GptTodoService gptTodoService,
                         NlpService nlpService,
                         TodoRepository todoRepository,
                         GptFinishService gptFinishService,
                         GptFinishNlpService gptFinishNlpService,
                         GptCompareTodo gptCompareTodo,
                         NlpCompareTodoService nlpCompareTodoService) {

        this.gptService = gptService;
        this.chatRepository = chatRepository;
        this.gptDiaryService = gptDiaryService;
        this.gptTodoService = gptTodoService;
        this.nlpService = nlpService;
        this.todoRepository = todoRepository;
        this.gptFinishService = gptFinishService;
        this.gptFinishNlpService = gptFinishNlpService;
        this.gptCompareTodo = gptCompareTodo;
        this.nlpCompareTodoService = nlpCompareTodoService;
    }
    @PostMapping("/api/v3/ask/{userId}") //채팅보내기 및 gpt답변호출 + 내가보낸 채팅이 일정이면, 채팅을 todo에 저장해줌
    public String ask(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String userMessage = request.get("chat_content"); // chat_content 입력받음

        try {
            boolean gptTodo = Boolean.parseBoolean(gptTodoService.askGpt(userMessage, userId));
            String chatEvent = null;
            boolean gptFinish = false;

            // gptTodo가 true일 경우, nlpService 호출
            String eventsString = null;
            String timesString = null;
            String datesString = null;
            if (gptTodo) { // 합쳐져 있는 event와 time을 각각 분리


                chatEvent = nlpService.askNlp(userMessage, userId);
                System.out.println("chatEvent : " + chatEvent);

                JSONArray mainArray = new JSONArray(chatEvent);

                // 첫 번째 배열에서 이벤트 추출
                JSONArray eventsArray = mainArray.getJSONArray(0);
                List<String> nlpEvents = new ArrayList<>();
                for (int i = 0; i < eventsArray.length(); i++) {
                    nlpEvents.add(eventsArray.getString(i));
                }
                // 두 번째 배열에서 시간 추출
                JSONArray timesArray = mainArray.getJSONArray(1);
                List<String> nlpTimes = new ArrayList<>();
                for (int i = 0; i < timesArray.length(); i++) {
                    nlpTimes.add(timesArray.getString(i));
                }

                // 세 번째 배열에서 날짜 추출
                JSONArray dateArray = mainArray.getJSONArray(2);
                List<String> nlpDates = new ArrayList<>();
                for (int i = 0; i < dateArray.length(); i++) {
                    nlpDates.add(dateArray.getString(i));
                }

                //대괄호 없이 출력되도록
                eventsString = String.join(", ", nlpEvents);
                timesString = String.join(", ", nlpTimes);
                datesString = String.join(", ", nlpDates);
            } else {
                // gptTodo가 false 일때만 발동하고, 해당 메시지가 일정완료와 관련된 메시지인지 판단

                if (userMessage.startsWith("응") || userMessage.startsWith("웅")) {

                    Chat recentTodoFinishChat = chatRepository.
                            findFirstByUserIdAndTodoFinishAskTrueOrderByChatDateDesc (userId)
                            // chat 생성날짜를 역순으로 돌려서 (최근 생성 순으로) todoFinishedAsk가 ture인거 찾기
                            .orElse(null);

                    if (recentTodoFinishChat != null){

                        gptFinish = true;

                    } else {
                        gptFinish = Boolean.parseBoolean(gptFinishService.askGpt(userMessage, userId));
                    }
                } else {
                    gptFinish = Boolean.parseBoolean(gptFinishService.askGpt(userMessage, userId));
                }
            }

            String gptFinishNlp = null;
            if (gptFinish){ // todo완료했다는 대답인지 검증
                gptFinishNlp = gptFinishNlpService.askNlp(userMessage, userId);
                System.out.println("Todo 완료 질문의 return 결과입니다 : " + gptFinishNlp);

                if (!"false".equals(gptFinishNlp)) {                                          // string 값 잘 출력될때

                    List<String> gptFinishNlps = Arrays.asList(gptFinishNlp.split(","));

                    for (int j = 0; j < gptFinishNlps.size(); j++){ // 갯수대로 todo title 비교

                        compareTodo(gptFinishNlps.get(j).trim(), userId); // todo 리스트들과 userMessage와 비교하는 함수
                    }

                } else {                                                                        // false 출력될때
                    gptAskTodo(userId); // gpt가 했냐고 물어보는 것에 대한 처리 함수 작동

                }
            } else {
                System.out.println("이 메시지는 todo 완료와 관련된 내용이 아니에요!");
            }

            // 첫 번째 Chat 엔티티를 생성하고 데이터베이스에 저장 (클라이언트가 보낸 메시지)
            ChatDTO initialChatDTO = new ChatDTO(null, userId, null, userMessage, false, gptTodo, eventsString, timesString, false, gptFinish);
            Chat initialChat = Chat.toSaveEntity(initialChatDTO);
            chatRepository.save(initialChat);

            if (eventsString != null){ // nlp 결과값 null인지 검증
                List<String> works = Arrays.asList(eventsString.split(","));
                List<String> times = Arrays.asList(timesString.split(","));
                List<String> dates = Arrays.asList(datesString.split(","));

                if (works.size() == times.size()){ // nlp 결과값 갯수 서로 같은지 검증
                    if (works.size() == dates.size()){
                        for (int i = 0; i < works.size(); i++){ // 갯수대로 todo에 저장
                            saveTodoAndDate(works.get(i).trim(), times.get(i).trim(), dates.get(i).trim(), userId); // gpt4이후 오류
                        }

                    } else {
                        for (int i = 0; i < works.size(); i++){ // 갯수대로 todo에 저장
                            System.out.println(works);
                            System.out.println(times);
                            System.out.println(dates);
                            saveTodo(works.get(i).trim(), times.get(i).trim(), userId);

                        }
                    }
                } else {
                    System.out.println("event와 time의 결과값 갯수가 서로 달라서 todo에 저장하진 않았어요!" +
                            "\n" + "event : "+eventsString + "time :" + timesString);
                }
            } else {
                System.out.println("nlp 결과값이 null값이라 todo에 저장하진 않았어요!" +
                        "\n" + "event : "+eventsString + "time :" + timesString);
            }

        } catch (Exception e){
            e.printStackTrace();
            return "GPT API 호출 오류가 발생했어요...ㅠ3ㅠ 아마.. API KEY가 잘못입력된 것 같아요..!!";
        }

        try {

            // GPT 서비스를 호출하여 응답 받기
            String gptResponse = gptService.askGpt(userMessage, userId);

            // GPT 응답을 새로운 Chat 엔티티의 chat_content로 설정하고 데이터베이스에 저장
            ChatDTO responseChatDTO = new ChatDTO(null, userId, null, gptResponse, true, false, null, null, false, false);
            Chat responseChat = Chat.toSaveEntity(responseChatDTO);
            chatRepository.save(responseChat);

            // GPT 응답을 클라이언트에 반환
            return gptResponse;

        } catch (Exception e) {
            String gptError = "gpt채팅 오류가 났어요.. 다시 시도해주시겠어요?";

            ChatDTO responseChatDTO = new ChatDTO(null, userId, null, gptError, true, false, null, null, false, false);
            Chat responseChat = Chat.toSaveEntity(responseChatDTO);
            chatRepository.save(responseChat);

            e.printStackTrace();
            return "GPT API 호출 오류가 발생했어요...ㅠ3ㅠ 아마.. API KEY가 잘못입력된 것 같아요..!! " +
                    "\n 우선 보내주신 채팅내용은 저장해놨어요 >_<";
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



    //todo 자동저장 함수
    private void saveTodo (String processedEvent, String processedTime, Long userId){
        String[] times = processedTime.split("~"); // ~ 기준으로 분리
        if (times.length == 2){
            String startTimeStr = times[0];
            String endTimeStr = times[1];

            // nlpEvent과 nlpTime을 Todo 테이블에 저장
            Todo newTodo = new Todo();
            newTodo.setUserId(userId); // userId 값 저장
            newTodo.setTodoTitle(processedEvent); // nlpEvent 값 저장

            // 여기서는 시간 정보를 String으로 다루고 있으므로, LocalTime을 다시 문자열로 변환
            newTodo.setTodoStartTime(startTimeStr.toString()); // 시작 시간 저장
            newTodo.setTodoEndTime(endTimeStr.toString()); // 종료 시간 저장

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            ZonedDateTime nowInSeoul = ZonedDateTime.now(ZoneId.of("Asia/Seoul")); // 서울 시간대로 선언

            String formattedDate = nowInSeoul.format(dateFormatter); // 현재 날짜를 "yyyy.MM.dd" 형식으로 포맷팅
            newTodo.setTodoDate(formattedDate); // 포맷팅된 날짜를 todoDate에 저장

            newTodo.setTodoDone(false);

            Random random = new Random();
            int colorIndex = random.nextInt(5) + 1; // 1~5 사이의 랜덤한 수 생성
            newTodo.setTodoColor("color" + colorIndex); // todoColor 저장

            todoRepository.save(newTodo); // Todo 저장

        } else {
            // nlpTime 형식이 예상과 다를 경우의 처리
            System.out.println("nlpTime 형식이 이상해요...ㅡ3ㅡ : " + processedTime);

        }

    }

    private void saveTodoAndDate (String processedEvent, String processedTime, String processedDate, Long userId){
        System.out.println("date값 : " + processedDate);
        System.out.println("event값 : " + processedEvent);
        System.out.println("time값 : " + processedTime);
        String[] times = processedTime.split("~"); // ~ 기준으로 분리
        if (times.length == 2){
            String startTimeStr = times[0];
            String endTimeStr = times[1];

            // nlpEvent과 nlpTime을 Todo 테이블에 저장
            Todo newTodo = new Todo();
            newTodo.setUserId(userId); // userId 값 저장
            newTodo.setTodoTitle(processedEvent); // nlpEvent 값 저장

            // 여기서는 시간 정보를 String으로 다루고 있으므로, LocalTime을 다시 문자열로 변환
            newTodo.setTodoStartTime(startTimeStr.toString()); // 시작 시간 저장
            newTodo.setTodoEndTime(endTimeStr.toString()); // 종료 시간 저장

            if (processedDate.matches("\\d{4}\\.\\d{2}\\.\\d{2}")) {
                newTodo.setTodoDate(processedDate); // 포맷팅된 날짜를 todoDate에 저장
            } else {
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
                String formattedDate = LocalDate.now().format(dateFormatter); // 현재 날짜를 "yyyy.MM.dd" 형식으로 포맷팅
                newTodo.setTodoDate(formattedDate); // 포맷팅된 날짜를 todoDate에 저장

            }

            newTodo.setTodoDone(false);

            Random random = new Random();
            int colorIndex = random.nextInt(5) + 1; // 1~5 사이의 랜덤한 수 생성
            newTodo.setTodoColor("color" + colorIndex); // todoColor 저장

            todoRepository.save(newTodo); // Todo 저장

        } else {
            // nlpTime 형식이 예상과 다를 경우의 처리
            System.out.println("nlpTime 형식이 이상해요...ㅡ3ㅡ : 여기가 gpt4이후로 오류" + processedTime);

        }

    }

    //todo 완료 비교 함수
    private void compareTodo(String userMessage, Long userId) throws Exception {
        //findByUserIdAndTodoDateAndTodoDone
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        String formattedToday = today.format(formatter);

        List<String> userTodos = todoRepository.
                findByUserIdAndTodoDateAndTodoDone(userId, formattedToday, false);

        if (!userTodos.isEmpty()){
            String mostSimilarItem = findMostSimilarItemBasedOnCharacterCount(userTodos, userMessage);

            System.out.println("userMessage : " + userMessage);
            System.out.println( userTodos);

            if (mostSimilarItem.isEmpty()){
                System.out.println("일치하는 항목 없습니다....");

                gptAskTodo(userId); // gpt가 했냐고 물어보는 것에 대한 처리 함수 작동

            } else {
                System.out.println("가장 유사한 항목: " + mostSimilarItem);

                todoRepository.markTodoAsDone(userId, mostSimilarItem, formattedToday);
            }

        } else {
            System.out.println( userId +"님의 오늘 todo가 존재하지 않습니다 ㅇ3ㅇ");
            System.out.println( userTodos);
        }
    }

    // 가장 많이 일치하는 글자 수를 가진 항목을 찾아냄
    private String findMostSimilarItemBasedOnCharacterCount(List<String> userTodos, String userMessage) {

        int maxCount = 0;
        String mostSimilarItem = "";

        for (String todo : userTodos) {
            int count = countMatchingCharacters(todo, userMessage);
            if (count > maxCount) {
                maxCount = count;
                mostSimilarItem = todo;
            }
        }
        return mostSimilarItem;
    }

    //메서드는 두 문자열 사이에서 공통으로 포함된 글자의 총 수를 계산
    private int countMatchingCharacters(String item, String userMessage) {
        int count = 0;
        for (char c : userMessage.toCharArray()) {
            if (item.contains(String.valueOf(c))) {
                count++;
            }
        }
        return count;
    }


    // GPT가 점검해주는 Todo 완료 함수
    private void gptAskTodo (Long userId) {

        Chat recentTodoFinishChat = chatRepository.
                findFirstByUserIdAndTodoFinishAskTrueOrderByChatDateDesc (userId)
                // chat 생성날짜를 역순으로 돌려서 (최근 생성 순으로) todoFinishedAsk가 ture인거 찾기
                .orElse(null);

        if (recentTodoFinishChat != null){
            String finishedTodo =  recentTodoFinishChat.getChatContent()
                    .replace("를 달성하셨나요?","");

            // 오늘 날짜를 xxxx.yy.zz 형식으로 포맷
            LocalDate today = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            String formattedToday = today.format(formatter);

            System.out.println(formattedToday);
            System.out.println(finishedTodo);

            // todoDate가 오늘 날짜와 동일하고, todoTitle이 finishedTodo와 같은 Todo 찾아서 todoDone을 true로 업데이트
            int updatedCount = todoRepository.
                    updateTodoDoneByUserIdAndTodoDateAndTodoTitle
                            (userId, formattedToday, finishedTodo);
            // userId랑 오늘 날짜, finishedTodo를 기반으로 todo에서 데이터 찾기
            // 그후 todoDone을 true로 바꿈
            if (updatedCount > 0) {
                System.out.println("Todo 완료 상태로 업데이트 되었습니다!");
                // todoFinishedAsk 다시 false로 돌리는 로직은.. 필요 없을 것 같아서 우선은 생략함
            } else {
                System.out.println("업데이트할 Todo가 없어요... :(");
            }
        } else {
            System.out.println("todo 완료에 대한 최근 대화가 없어요!");
            // 여기도 로직 수정해야됨
        }

    }
}
