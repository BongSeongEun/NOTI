package hello.hellospring.service.AI;

import hello.hellospring.model.Chat;
import hello.hellospring.model.Diary;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.DiaryRepository;
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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GptServiceImpl implements GptDiaryService {
    //GPT 일기생성 관련 API

    private final ChatRepository chatRepository;

    @Value("${openai.api.key}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기


    @Autowired
    public GptServiceImpl(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Autowired
    private DiaryRepository diaryRepository;

    @Override
    public String askGpt(String userMessage){

        return "GPT 모델 응답: " + userMessage;
    }

    @Override
    public String createDiary(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfPreviousDay = now.minusDays(1);

        // 지정된 사용자 ID와 시간 범위에 해당하는 chatContent 조회
        List<Chat> chats = chatRepository.findChatsByUserIdAndTimeRange(userId, startOfPreviousDay, now);

        // Chat 목록에서 chatContent만 추출하여 결합
        String diaryInputs = chats.stream()
                .map(Chat::getChatContent)
                .collect(Collectors.joining(" "));

        String diaryContent = ""; // 생성된 일기 내용을 저장할 변수
        String diaryTitle = "";   // 생성된 일기 제목을 저장할 변수

        try { // 대화한 내용 기반으로 일기내용 생성
            diaryContent = callGptApi(diaryInputs, "이것들은 오늘 나의 대화내용이야. 이 내용들을 조합해서 하루 일기를 작성해줘. " +
                    "모든 내용을 조합할 필요는 없고 많이 언급된 토픽들 위주로 일기를 생성해줘. 마치 내가 쓴것처럼." +
                    "답변은 존댓말로 통일해줘" +
                    "했던말은 반복하지마" +
                    "꼭 몇시에 무엇을 했고, 몇시에 어떤걸 했다 라는 형식으로 작성해줘" +
                    "마지막 부분에는 오늘은 ~~한 하루였다는 식으로 하루 총평을 해줘");

            // 생성된 일기 내용을 기반으로 제목 생성
            diaryTitle = callGptApi(diaryContent, "이 일기 내용을 기반으로 일기 제목을 생성해줘." +
                    "여기 내용중에 가장 많이 나온 내용을 토픽으로 제목을 써주면돼");

            Diary diary = new Diary();
            diary.setUserId(userId); //user_id에 저장
            diary.setDiaryTitle(diaryTitle); //diary_title에 저장
            diary.setDiaryContent(diaryContent); //diary_content에 저장

            String formattedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")); //생성시간 구하기
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
        jsonBody.put("model", "gpt-3.5-turbo");

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
