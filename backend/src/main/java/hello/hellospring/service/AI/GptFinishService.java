package hello.hellospring.service.AI;

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

@Service
public class GptFinishService {
    // 해당 대화가 일정완료 했다는 gpt인지 true or false

    @Autowired
    private ChatRepository chatRepository; //ChatRepository 참조

    @Value("${openai.api.key.e}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기

    public String askGpt(String userMessage, Long userId) throws Exception {
        JSONArray messagesArray = new JSONArray(); // 모든 Chat 내용과 사용자 메시지를 JSON 요청 바디에 추가

        messagesArray.put(new JSONObject().put("role", "system")
                .put("content", "다음 메시지가 일정 완료 관련 메시지인지 분류해주세요" +
                        "했어, 달성했어, 완료했어 처럼 ~를 했다는 내용이 존재하면 true로 분류해줘" +
                        "~를 할거야, ~ 예정이야 처럼 미래형의 내용이 존재하면 false로 분류해줘" +
                        "답은 오직 true 아니면 false로 해줘"));

        messagesArray.put(new JSONObject().put("role", "user").put("content", userMessage));

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messagesArray);
        jsonBody.put("max_tokens", 10); // 답변 최대 글자수
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

            System.out.println("이 질문은 Todo 완료입니까? : " + content);

            if ("true".equalsIgnoreCase(content) || "false".equalsIgnoreCase(content)) {
                return content;
            } else {
                // content가 "true" 또는 "false"가 아닌 경우 null 반환
                return "false";
            }
        } else {
            return "사용가능한 content가 아니에요!! :(";
        }

    }
}
