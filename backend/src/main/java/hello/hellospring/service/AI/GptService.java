package hello.hellospring.service.AI;

import hello.hellospring.model.Chat;
import hello.hellospring.repository.ChatRepository;
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
public class GptService {
    // GPT 대화 관련 API

    @Autowired
    private ChatRepository chatRepository; //ChatRepository 참조

    @Value("${openai.api.key.g}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기

    public String askGpt(String userMessage, Long userId) throws Exception {
        List<Chat> userChats = chatRepository.findByUserId(userId);
        String allChatContents = userChats.stream()
                .map(Chat::getChatContent)
                .collect(Collectors.joining("\n"));

        JSONArray messagesArray = new JSONArray(); // 모든 Chat 내용과 사용자 메시지를 JSON 요청 바디에 추가

        // 이전 채팅내용 학습
        if (!allChatContents.isEmpty()) {
            messagesArray.put(new JSONObject().put("role", "user").put("content", allChatContents));
        }

        messagesArray.put(new JSONObject().put("role", "system").put("content",
                "내가 하는 말에 대화가 안끊기도록 해주고, 왜 이걸 하는지 물어봐줘. 질문은 한번만 해줘" +
                "모든 대답은 존댓말로 해주고,  공감식 말투로 대답해줘. 사족은 달지말고 간결하고 짧게 대답해줘" +
                        "80자 내외로 답변해줘. 90자는 넘지않았으면 좋겠어."));

        messagesArray.put(new JSONObject().put("role", "user").put("content", userMessage));

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messagesArray);
        jsonBody.put("max_tokens", 200); // 답변 최대 글자수
        jsonBody.put("n", 1); // 한 번의 요청에 대해 하나의 응답만 받기
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

        // JSON 응답에서 content만 추출 (여기 없애면 다 뜸)
        JSONObject jsonResponse = new JSONObject(responseBody);
        JSONArray choices = jsonResponse.getJSONArray("choices");
        if (choices.length() > 0) {
            JSONObject firstChoice = choices.getJSONObject(0);
            JSONObject message = firstChoice.getJSONObject("message");
            String content = message.getString("content");
            return content; // content만 반환
        } else {
            return "사용가능한 content가 아니에요!! :(";
        }
    }

}
