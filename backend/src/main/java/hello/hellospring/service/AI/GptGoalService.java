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
public class GptGoalService {

    @Autowired
    private ChatRepository chatRepository; //ChatRepository 참조

    @Value("${openai.api.key.e}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기

    public String askGpt(String output) throws Exception {

        JSONArray messagesArray = new JSONArray();
        // 모든 Chat 내용과 사용자 메시지를 JSON 요청 바디에 추가
        messagesArray.put(new JSONObject().put("role", "system")
//                .put("content", "이것은 이번달 나의 모든 일정에 대한 title, status, duration minutes 입니다." +
//                        "이 데이터들을 토대로 다음달에 내가 성장하기 위해서 어떤 일정이 필요할지 추천해주세요" +
//                        "추천하는 일정, 그 일정의 추천하는 달성률, 그 일정을 한달동안 진행하는 minutes 목표로 답변해주세요" +
//                        "답변은 배열형식으로 [[],[],[]] 리턴해주세요. 첫번째 배열에는 일정, 두번째 배열에는 달성률, 세번째 배열에는 minutes를 넣어주세요" +
//                        "첫번째 배열에는 핵심 키워드만, 두번째 배열과 세번째 배열에는 숫자만 입력해주세요" +
//                        "총 3개의 일정을 추천해주세요. 일정마다 구분은 [] 안에서 쉼표를 통해서 해주시면됩니다" +
//                        "[[1번째 추천 내용, 2번째 추천 내용, 3번째 추천 내용],[1번째 추천내용 달성률, 2번째 추천내용 달성률, 3번째 추천내용 달성률],[1번째 추천내용 minutes, 2번째 추천내용 minutes, 3번째 추천내용 minutes]] 처럼 출력해주면 돼"));
                .put("content", "이것은 이번달 나의 모든 일정에 대한 정보들 입니다." +
                        "이 데이터들을 토대로 새로운 추천일정, 달성률, 총 miuntes를 출력해주세요" +
                        "배열 형식으로 출력해주세요. 첫번째 배열에는 일정, 두번째 배열에는 달성률(%단위), 세번째 배열에는 총 시간(miuntes)를 출력해주세요." +
                        "내용은 배열당 3개까지 출력해주고, 이후 내용은 출력하지 말아주세요" +
                        "일정 관련 내용은 새로운 내용으로 창조해서 출력해주세요. 예를들어 코딩, 노래, 자전거" +
                        "각각 내용 들이 다른 성격의 단어가 될 수 있도록 출력해주시면 고마울것같아요" +
                        "달성률 관련 내용은 모두 65 이상으로 랜덤으로 출력해주세요" +
                        "제목은 출력하지 않고 내용만 출력해주시면 됩니다." +
                        "배열 형식은 [],[],[] 로만 출력해주세요. []안에 \"\"는 넣지 말아주세요." +
                        "줄바꿈은 안해주셔도 됩니다." +
                        "배열 사이에 \",\" 꼭 붙여주세요"));


        messagesArray.put(new JSONObject().put("role", "user").put("content", output));

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messagesArray);
        jsonBody.put("max_tokens", 600); // 답변 최대 글자수
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
            return "사용가능한 content가 아니에요!! :(";
        }

    }


}
