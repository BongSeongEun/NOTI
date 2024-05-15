package hello.hellospring.service.AI;

import hello.hellospring.model.Chat;
import hello.hellospring.model.Diary;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.DiaryRepository;
import hello.hellospring.repository.TodoRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GptServiceImpl implements GptDiaryService {
    //GPT 일기생성 관련 API

    private final ChatRepository chatRepository;

    @Value("${openai.api.key.b}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기


    @Autowired
    public GptServiceImpl(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private TodoRepository todoRepository;

    @Override
    public String askGpt(String userMessage){

        return "GPT 모델 응답: " + userMessage;
    }

    @Override
    public String createDiary(Long userId) {
        // 서울 시간대 설정
        ZoneId seoulZoneId = ZoneId.of("Asia/Seoul");


        // 채팅했던 내역들 끌어다오기
        ZonedDateTime nowSeoul = ZonedDateTime.now(seoulZoneId);
        LocalDateTime now = nowSeoul.toLocalDateTime();
        LocalDateTime startOfPreviousDay = now.minusDays(1);

        // 지정된 사용자 ID와 시간 범위에 해당하는 chatContent 조회
        List<Chat> chats = chatRepository.findChatsByUserIdAndTimeRange(userId, startOfPreviousDay, now);

        // Chat 목록에서 chatContent만 추출하여 결합
        String diaryInputs = chats.stream()
                .map(Chat::getChatContent)
                .collect(Collectors.joining(" "));

        String diaryContent = ""; // 생성된 일기 내용을 저장할 변수
        String diaryTitle = "";   // 생성된 일기 제목을 저장할 변수
        String dirayEmotion = ""; // 생성된 일기 감정을 저장할 변수


        // 투두리스트 내용 끌어다오기
        String todayStr = nowSeoul.toLocalDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")); //타입 변환
        List<Todo> todos = todoRepository.findByUserIdAndTodoDate(userId, todayStr);

        String todoContents = todos.stream()
                .map(todo -> todo.getTodoTitle() + ":" + (todo.isTodoDone() ? "달성성공" : "달성실패"))
                .collect(Collectors.joining(", "));

//        if (diaryInputs.isEmpty() && todoContents.isEmpty()){
//
//        } else {
//
//        }

        // diaryContent + todoContents 둘이 합치기
        String combinedInputs = diaryInputs + "= 이거는 오늘 하루동안 gpt와 대화했던 내용들이고"
                + "\n" + todoContents + "= 이거는 오늘 하루동안의 일정목록이야.";

        try { // 대화한 내용 기반으로 일기내용 생성
            diaryContent = callGptApi(combinedInputs, "이 내용들을 조합해서 하루 일기를 작성해줘. " +
                    "모든 내용을 조합할 필요는 없고 많이 언급된 토픽들 위주로 일기를 생성해줘. 마치 내가 쓴것처럼." +
                    "답변은 존댓말로 통일해줘" +
                    "했던말은 반복하지마" +
                    "그 다음 문단에는 하루동안의 일정목록 내용들을 통해 ~~는 달성했고, ~~는 달성하지못했다 라는 내용도 넣어줘" +
                    "꼭 몇시에 무엇을 했고, 몇시에 어떤걸 했다 라는 형식으로 작성해줘" +
                    "마지막 부분에는 오늘은 ~~한 하루였다는 식으로 하루 총평을 해줘" +
                    "총 내용은 2~줄 분량으로 (200자가 넘지 않도록) 간략하게 작성부탁해");

            // 생성된 일기 내용을 기반으로 제목 생성
            diaryTitle = callGptApi(diaryContent, "이 일기 내용을 기반으로 일기 제목을 생성해줘." +
                    "여기 내용중에 가장 많이 나온 내용을 토픽으로 제목을 써주면돼");

            dirayEmotion = callGptApi(diaryContent, "너의 임무는 감정 nlp 분류야. " +
                    "0~100중에서 숫자가 높을수록 긍정적인 감정이고 숫자가 낮을수록 부정적인 감정이라고 치자. " +
                    "위 내용들을 학습하고, 감정에 관한 단어들을 뽑아서 종합적으로 판단을 해보고, " +
                    "이 일기에서 감정은 어땠는지 0~100중에 숫자를 뽑아줘" +
                    "결과값은 다른 설명들 하지말고 오직 숫자만 뽑아주면 돼");

            long diaryEmotionScore;

            try { // 감정 점수를 숫자로 변환
                diaryEmotionScore = Long.valueOf(dirayEmotion); // 감정 점수를 숫자로 변환
            } catch (NumberFormatException e) {
                diaryEmotionScore = 3; // 숫자가 아니면 3으로 처리
            }

            long diaryEmotionResult;

            if (diaryEmotionScore >= 91 && diaryEmotionScore <= 100) {
                diaryEmotionResult = 5;
            } else if (diaryEmotionScore >= 81) {
                diaryEmotionResult = 4;
            } else if (diaryEmotionScore >= 61) {
                diaryEmotionResult = 3;
            } else if (diaryEmotionScore >= 41) {
                diaryEmotionResult = 2;
            } else {
                diaryEmotionResult = 1;
            }

            Diary diary = new Diary();
            diary.setUserId(userId); //user_id에 저장
            diary.setDiaryTitle(diaryTitle); //diary_title에 저장
            diary.setDiaryContent(diaryContent); //diary_content에 저장
            diary.setDiaryEmotion(diaryEmotionResult); //diary_emotion에 저장

            String formattedDate = nowSeoul.toLocalDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")); //생성시간 구하기
            diary.setDiaryDate(formattedDate); //diary_date에 저장
            diaryRepository.save(diary);

            return "제목: " + diaryTitle + "\n내용: " + diaryContent + "\n날짜: " + formattedDate;

        } catch (Exception e) {
            e.printStackTrace();
            return "일기 생성에 실패했어요....:(";
        }

    }
    private String callGptApi(String inputs, String prompt) throws Exception {
        JSONArray messagesArray = new JSONArray();
        messagesArray.put(new JSONObject().put("role", "system").put("content", prompt));
        messagesArray.put(new JSONObject().put("role", "user").put("content", inputs));

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messagesArray);
        jsonBody.put("max_tokens", 1000);
        jsonBody.put("n", 1);
        jsonBody.put("temperature", 0.7);
        jsonBody.put("model", "gpt-4o");

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + API_KEY)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody.toString()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();

        JSONObject jsonResponse = new JSONObject(responseBody);
        JSONArray choices = jsonResponse.getJSONArray("choices");
        if (choices.length() > 0) {
            JSONObject firstChoice = choices.getJSONObject(0);
            JSONObject message = firstChoice.getJSONObject("message");
            return message.getString("content"); // GPT로부터 생성된 일기 내용 반환
        } else {
            return "GPT생성 API 호출에 실패했어요... :(";
        }
    }


}
