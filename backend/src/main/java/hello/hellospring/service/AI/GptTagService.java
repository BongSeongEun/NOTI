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
public class GptTagService {
    // 이 메시지가 일정 관련인지 ture or false

    @Autowired
    private ChatRepository chatRepository; //ChatRepository 참조

    @Value("${openai.api.key.e}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기

    public String askGpt(String todoTitle) throws Exception{
        JSONArray messagesArray = new JSONArray(); // 모든 Chat 내용과 사용자 메시지를 JSON 요청 바디에 추가

        messagesArray.put(new JSONObject().put("role", "system")
                .put("content", "다음 메시지의 핵심 키워드를 단어를 추출해주세요. " +
                        "딱 하나의 단어로만 추출해줘야하고 (키워드 : 밥 이런거 안된다는 소리야), 대략적이면서 포괄적인 단어로 추출해주세요." +
                        "예를들어서 수학 수업 학습 공부 이런 말이 들어가있으면 공부를 추출해주세요" +
                        "예를들어서 식사 점심 저녁 밥 먹는다 이런 말이 들어가있으면 식사로 추출해주세요"));

        messagesArray.put(new JSONObject().put("role", "user").put("content", todoTitle));

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

            System.out.println("todo 핵심키워드 추출: " + content);

            return content;
        } else {
            return "사용가능한 content가 아니에요!! :(";
        }

    }
}
