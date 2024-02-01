package hello.hellospring.api;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class OpenAIApi {

    @Value("${openai.api.key}")
    private static String API_KEY;

    //private final static String API_KEY = "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";
    public static String ask(String userMessage) throws JSONException {
        String responseBody = "";

        JSONArray messagesArray = createMessages(userMessage);

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messagesArray);
        jsonBody.put("max_tokens", 50);
        jsonBody.put("n", 2);
        jsonBody.put("temperature", 0.7);
        jsonBody.put("model", "gpt-3.5-turbo-1106");


        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + API_KEY)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody.toString()))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            responseBody = extractAnswer(response.body());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return responseBody;
    }

    private static JSONArray createMessages(String userMessage) throws JSONException {
        JSONArray messagesArray = new JSONArray();
        messagesArray.put(new JSONObject().put("role", "system").put("content", "내가 하는 말에 대화가 안끊기도록 해줘"));
        messagesArray.put(new JSONObject().put("role", "user").put("content", userMessage));
        return messagesArray;
    }

    private static String extractAnswer(String responseJson) throws JSONException {
        JSONObject jsonObject = new JSONObject(responseJson);

        if (jsonObject.has("choices")) {
            JSONArray choicesArray = jsonObject.getJSONArray("choices");

            if (choicesArray.length() > 0) {
                JSONObject firstChoice = choicesArray.getJSONObject(0);

                if (firstChoice.has("message")) {
                    JSONObject message = firstChoice.getJSONObject("message");

                    if (message.has("content")) {
                        return message.getString("content").trim();
                    } else {
                        System.err.println("Error: 'content' key not found in the 'message' object");
                        return "API 호출 중 오류 발생";
                    }
                } else {
                    System.err.println("Error: 'message' key not found in the first choice of API response");
                    return "API 호출 중 오류 발생";
                }
            } else {
                System.err.println("Error: 'choices' array is empty in API response");
                return "API 호출 중 오류 발생";
            }
        } else {
            System.err.println("Error: 'choices' array not found in API response");
            return "API 호출 중 오류 발생";
        }
    }


}