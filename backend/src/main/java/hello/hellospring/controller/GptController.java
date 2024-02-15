package hello.hellospring.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import org.json.JSONArray;
import org.json.JSONObject;

@RestController
public class GptController {

    private static final String API_KEY = "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"; // 환경변수에서 API 키를 불러옵니다.

    @PostMapping("/ask")
    public String ask(@RequestBody String userMessage) {
        try {
            return askGpt(userMessage);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing your request.";
        }
    }

    public static String askGpt(String userMessage) throws Exception {
        String responseBody = "";

        JSONArray messagesArray = new JSONArray();
        messagesArray.put(new JSONObject().put("role", "user").put("content", userMessage));

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messagesArray);
        jsonBody.put("max_tokens", 50);
        jsonBody.put("n", 1); // 한 번의 요청에 대해 하나의 응답만 받습니다.
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
        responseBody = response.body();

        // JSON 응답에서 content만 추출
        JSONObject jsonResponse = new JSONObject(responseBody);
        JSONArray choices = jsonResponse.getJSONArray("choices");
        if (choices.length() > 0) {
            JSONObject firstChoice = choices.getJSONObject(0);
            JSONObject message = firstChoice.getJSONObject("message");
            String content = message.getString("content");
            return content; // content만 반환
        } else {
            return "No content available";
        }
    }

}
