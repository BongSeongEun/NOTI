package hello.hellospring.service.AI;

import hello.hellospring.model.Todo;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.TodoRepository;
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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GptCompareTodo {
    // 분류된 todo달성 메시지를 분석

    @Autowired
    private TodoRepository todoRepository;

    @Value("${openai.api.key.g}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기

    public String askGpt(String userMessage, Long userId) throws Exception {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        String formattedToday = today.format(formatter);

        List<Todo> userTodos = todoRepository
                .findByUserIdAndTodoDateAndTodoDone(userId, formattedToday,false);

        String resultTodos = userTodos.stream()
                .map(todo -> todo.getTodoId() + ": " + todo.getTodoTitle())
                .collect(Collectors.joining(", "));

        JSONArray messagesArray = new JSONArray(); // 모든 Chat 내용과 사용자 메시지를 JSON 요청 바디에 추가

        // 기존 todo 내용들 학습시키기
        if (!resultTodos.isEmpty()) {
            messagesArray.put(new JSONObject().put("role", "user")
                    .put("content",
                            resultTodos + ". 다음과 같이 나열된 행동중에서 주어가" + userMessage +"와 비슷한 행동을 하는 번호를 찾아줄래?" +
                                    "예를 들면, 12 : 짜장면 먹기, 18: 옷사기. 다음과 같이 나열된 행동 중에서 옷샀다와 비슷한 행동을 하는 번호를 찾아줄래? 라고 주어졌으면 18 : 옷사기 를 출력해주면돼" +
                                    "하나만 출력해줘야해. 만약에 비슷한 행동을 하는 번호가 없으면 null값을 출력해줘"));
        } else {
            messagesArray.put(new JSONObject().put("role", "user").put("content", "null값을 출력해줘"));

        }
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

            System.out.println("Gpt~ : " + content);
            System.out.println("resultTodos : " +resultTodos);
            System.out.println("userMessage : " +userMessage);

            return content;

        } else {
            return "사용가능한 content가 아니에요!! :(";
        }
    }
}
