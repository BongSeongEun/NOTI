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
public class GptFinishNlpService {
    // todo완료 채팅에 대해서 nlp 분류

    @Autowired
    private ChatRepository chatRepository; //ChatRepository 참조

    @Value("${openai.api.key.f}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기

    public String askNlp(String userMessage, Long userId) throws Exception {
        JSONArray messagesArray = new JSONArray(); // 모든 Chat 내용과 사용자 메시지를 JSON 요청 바디에 추가

        messagesArray
                .put(new JSONObject().put("role", "system")
                .put("content"
                        , "~를 했어, ~완료했어 처럼 문장에서 끝말을 없애줘" +
                                "예를 들어 라면먹기를 달성했어, 공부하기를 달성했어 는 라면먹기, 공부하기 이렇게 출력해주면 돼" +
                                "만약, 운동하기랑 김밥먹기를 달성했어 이런식으로 여러개를 달성했으면 운동하기, 밥먹기 이런식으로 출력해주면 돼" +
                                "만약, 응 달성했어, 했어 이런식으로 ~를 ~는 라는 (목적어) 내용이 없으면 false로 출력해줘" +
                                "만약 하와이에 가기 이런식으로 말했으면, 하와이에 가기 하나로만 출력해주면돼"));

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

            //System.out.println("Todo 완료 질문의 return 결과입니다 : " + content);

            return content;

        } else {
            return "사용가능한 content가 아니에요!! :(";
        }
    }
}
