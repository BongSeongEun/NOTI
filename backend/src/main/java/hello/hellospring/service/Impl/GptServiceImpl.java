package hello.hellospring.service.Impl;

import hello.hellospring.model.Chat;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.service.GptDiaryService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
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

    @Override
    public String askGpt(String userMessage){

        return "GPT 모델 응답: " + userMessage;
    }

    @Override
    public String createDiary(Long userId) {
        // userId에 해당하는 Chat 목록 조회
        List<Chat> chats = chatRepository.findByUserId(userId);
        // Chat 목록에서 chatContent만 추출하여 결합
        String diaryInputs = chats.stream()
                .map(Chat::getChatContent)
                .collect(Collectors.joining(" "));

        try {
            JSONArray messagesArray = new JSONArray();
            messagesArray.put(new JSONObject().put("role", "system")
                    .put("content", "이것들은 오늘 나의 대화내용이야. 이 내용들을 조합해서 하루 일기를 작성해줘. " +
                            "모든 내용을 조합할 필요는 없고 많이 언급된 토픽들 위주로 일기를 생성해줘. 마치 내가 쓴것처럼." +
                            "모든것은 존댓말로 통일해줘"));
            messagesArray.put(new JSONObject().put("role", "user").put("content", diaryInputs));

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
                String content = message.getString("content");
                return content; // GPT로부터 생성된 일기 내용 반환
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "일기 생성에 실패했습니다.";
    }
}
