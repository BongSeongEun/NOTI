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
public class GptSummaryService {

    @Autowired
    private ChatRepository chatRepository; //ChatRepository 참조

    @Value("${openai.api.key.d}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기

    public String askGpt(String output) throws Exception {
        try{
            JSONArray messagesArray = new JSONArray();
            // 모든 Chat 내용과 사용자 메시지를 JSON 요청 바디에 추가
            messagesArray.put(new JSONObject().put("role", "system")
                    .put("content", "이것은 이번달 나의 모든 일정에 대한 정보들 입니다." +
                            "이 데이터들을 토대로 이번달의 한줄 평을 작성해주세요." +
                            "300자 이내로 작성해주시면 됩니다."));


            messagesArray.put(new JSONObject().put("role", "user").put("content", output));

            JSONObject jsonBody = new JSONObject();
            jsonBody.put("messages", messagesArray);
            jsonBody.put("max_tokens", 300); // 답변 최대 글자수
            jsonBody.put("n", 1); // 한 번의 요청에 대해 하나의 응답만 받기
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

            // JSON 응답에서 content만 추출 (여기 없애면 다 뜸)
            JSONObject jsonResponse = new JSONObject(responseBody);
            JSONArray choices = jsonResponse.getJSONArray("choices");
            if (choices.length() > 0) {
                JSONObject firstChoice = choices.getJSONObject(0);
                JSONObject message = firstChoice.getJSONObject("message");
                String content = message.getString("content");

                System.out.println("GPT의 일정추천 : " + content);

                return content;

            } else {
                String ErrorContent = "GPT가 오류가 났어요. 나중에 다시 시도해주세요.";
                return ErrorContent;
            }
        } catch (Exception e){
            e.printStackTrace();

            String ErrorContent = "GPT가 오류가 났어요. 나중에 다시 시도해주세요.";
            return ErrorContent;

        }





    }
}
