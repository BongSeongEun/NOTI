package hello.hellospring.service.AI;

import hello.hellospring.repository.ChatRepository;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class NlpService {
    // 메시지를 nlp로 분류

    @Autowired
    private ChatRepository chatRepository; //ChatRepository 참조

    @Value("${openai.api.key.d}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기


    public String askNlp(String userMessage, Long userId) throws JSONException, IOException, InterruptedException {

        JSONArray messagesArray = new JSONArray(); // 모든 Chat 내용과 사용자 메시지를 JSON 요청 바디에 추가

        messagesArray.put(new JSONObject().put("role", "system")
                .put("content", "이 문장을 nlp기술로 event와 time과 date를 분리해줘" +
                        "배열 형식으로 결과값을 리턴해줘.7시에 커피집을 갔다하면 [커피집을 갔다],[07:00~07:00],[2024.02.29] 이런식으로" +
                        "만약 a시부터 b시까지 c을 한다하면 [c를 한다],[a:00~b:00][2024.02.29] 이런식으로"+
                        "첫번째 배열에는 event를 넣어주고, 두번째 배열에는 time을 넣어주고, 세번째 배열에는 date를 넣어줘" +
                        "time의 경우에는 xx:yy~xx:yy 형식으로 값을 넣어줘" +
                        "date의 경우에는 언급이 없으면 오늘 날짜 (2024.02.29 형식으로) 를 넣어주고, 내일이라고 하면 오늘날짜를 기준으로 다음날짜를 넣어줘" +
                        "event랑 time과 date가 여러개이면 : [[운전을 한다, 집에 간다],[02:00~02:00,06:00~06:00],[2024.02.29, 2024.02.29]] 이런식으로 분리해줘"));

        messagesArray.put(new JSONObject().put("role", "user").put("content", userMessage));

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messagesArray);
        jsonBody.put("max_tokens", 1000); // 답변 최대 글자수
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

            // 예외처리 우선 해놓음
            try {
                // content 형식 검증
                JSONArray contentArray = new JSONArray(content);
                if (contentArray.length() == 3
                        && contentArray.getJSONArray(0).length() > 0
                        && contentArray.getJSONArray(1).length() > 0
                        && contentArray.getJSONArray(2).length() > 0) {
                    // 형식이 올바른 경우, content 반환
                    System.out.println("NLP 결과물 : " + content);
                    return content;
                } else {
                    // 형식이 올바르지 않은 경우, 빈 배열 반환
                    return "[[\"\"],[\"\"],[\"\"]]";
                }
            } catch (JSONException e) {
                // JSON 파싱 오류 발생 시, 빈 배열 반환
                return "[[\"\"],[\"\"],[\"\"]]";
            }

        } else {
            return "사용가능한 content가 아니에요!! :(";
        }
    }
}
