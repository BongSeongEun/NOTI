package hello.hellospring.service.AI;

import hello.hellospring.model.Chat;
import hello.hellospring.model.Diary;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.DiaryRepository;
import hello.hellospring.repository.TodoRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GptServiceImpl implements GptDiaryService {
    //GPT 일기생성 관련 API

    private final ChatRepository chatRepository;

    @Value("${openai.api.key.b}")
    private String API_KEY; // 환경변수에서 API 키를 불러오기


    @Autowired
    public GptServiceImpl(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private TodoRepository todoRepository;

    @Override
    public String askGpt(String userMessage){

        return "GPT 모델 응답: " + userMessage;
    }

    @Override
    public String createDiary(Long userId) {
        // 서울 시간대 설정
        ZoneId seoulZoneId = ZoneId.of("Asia/Seoul");


        // 채팅했던 내역들 끌어다오기
        ZonedDateTime nowSeoul = ZonedDateTime.now(seoulZoneId);
        LocalDateTime now = nowSeoul.toLocalDateTime();
        LocalDateTime startOfPreviousDay = now.minusDays(1);

        // 지정된 사용자 ID와 시간 범위에 해당하는 chatContent 조회
        List<Chat> chats = chatRepository.findChatsByUserIdAndTimeRange(userId, startOfPreviousDay, now);

        // Chat 목록에서 chatContent만 추출하여 결합
        String diaryInputs = chats.stream()
                .map(Chat::getChatContent)
                .collect(Collectors.joining(" "));

        String diaryContent = ""; // 생성된 일기 내용을 저장할 변수
        String diaryTitle = "";   // 생성된 일기 제목을 저장할 변수
//        String dirayEmotion = ""; // 생성된 일기 감정을 저장할 변수



        // 투두리스트 내용 끌어다오기
        String todayStr = nowSeoul.toLocalDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")); //타입 변환
        List<Todo> todos = todoRepository.findByUserIdAndTodoDate(userId, todayStr);

        String todoContents = todos.stream()
                .map(todo -> todo.getTodoTitle() + ":" + (todo.isTodoDone() ? "달성성공" : "달성실패"))
                .collect(Collectors.joining(", "));

        if (diaryInputs.isEmpty() && todoContents.isEmpty()){
            System.out.println("오늘 활동이 없어요..");

            return "오늘은 활동이 없어요";
        }

        // diaryContent + todoContents 둘이 합치기
        String combinedInputs = diaryInputs + "= 이거는 오늘 하루동안 gpt와 대화했던 내용들이고"
                + "\n" + todoContents + "= 이거는 오늘 하루동안의 일정목록이야.";

        try { // 대화한 내용 기반으로 일기내용 생성
            diaryContent = callGptApi(combinedInputs, "이 내용들을 조합해서 하루의 루틴 분석을 간단하게 작성해줘. " +
                    "많이 언급된 토픽들 위주로 오늘 하루의 루틴 분석을 해줘." +
                    "답변은 존댓말로 통일해줘" +
                    "했던말은 반복하지마" +
                    "그 다음 문단에는 하루동안의 일정목록 내용들을 통해 ~~는 달성했고, ~~는 달성하지못했다 라는 내용도 넣어줘" +
                    "꼭 몇시에 무엇을 했고, 몇시에 어떤걸 했다 라는 형식으로 작성해줘" +
                    "마지막 부분에는 덕담이나 위로나 응원의 한마디로 마무리해줘" +
                    "총 내용은 150자 안으로 작성부탁해");

            // 생성된 일기 내용을 기반으로 제목 생성
            diaryTitle = callGptApi(diaryContent, "이 하루 루틴을 기반으로 하루 루틴의 제목을 생성해줘." +
                    "여기 내용중에 가장 많이 나온 내용을 토픽으로 제목을 써주면돼");

//            dirayEmotion = callGptApi(diaryContent, "너의 임무는 감정 nlp 분류야. " +
//                    "0~100중에서 숫자가 높을수록 긍정적인 감정이고 숫자가 낮을수록 부정적인 감정이라고 치자. " +
//                    "위 내용들을 학습하고, 감정에 관한 단어들을 뽑아서 종합적으로 판단을 해보고, " +
//                    "이 일기에서 감정은 어땠는지 0~100중에 숫자를 뽑아줘" +
//                    "결과값은 다른 설명들 하지말고 오직 숫자만 뽑아주면 돼");

            String formattedDate =
                    nowSeoul.toLocalDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")); //생성시간 구하기

            double completionRate = 0;

            try {
                List<Todo> allTodos = todoRepository.findAllTodosByMonthAndUserId(userId, formattedDate);
                List<Todo> completedTodos = todoRepository.findCompletedTodosByMonthAndUserId(userId, formattedDate);

                // 모든 일정의 수
                int totalTodos = allTodos.size();
                // 완료된 일정의 수
                int completedTodosCount = completedTodos.size();

                // 모든 일정 중에서 달성한 일정의 비율 계산
                if (totalTodos > 0) { // 분모가 0이 되는 경우를 방지
                    completionRate = ((double) completedTodosCount / totalTodos) * 100;
                }

                System.out.println("오늘 일정 수 :" + totalTodos);
                System.out.println("일정 중 달성갯수 :" + completedTodosCount);
            } catch (Exception e){
                System.err.println("일정 달성 평균계산 실패!" + e.getMessage());
                completionRate = 0;
            }

            long todayEmotionResult;

            if (completionRate >= 81 && completionRate <= 100) {
                todayEmotionResult = 5;
            } else if (completionRate >= 61) {
                todayEmotionResult = 4;
            } else if (completionRate >= 41) {
                todayEmotionResult = 3;
            } else if (completionRate >= 21) {
                todayEmotionResult = 2;
            } else {
                todayEmotionResult = 1;
            }

            String imagePrompt = diaryContent +"위 일기 내용을 기반으로 나의 오늘의 일상 부분 중 하나를 이미지화 해서 생성해줘";
            String imgResult = generateImage(imagePrompt);
            String imageUrl = encodeToBase64(imgResult, 200, 200);
//            System.out.println("인코딩 반환값은? :" + imageUrl);



            Diary diary = new Diary();
            diary.setUserId(userId); //user_id에 저장
            diary.setDiaryTitle(diaryTitle); //diary_title에 저장
            diary.setDiaryContent(diaryContent); //diary_content에 저장
            diary.setDiaryEmotion(todayEmotionResult); //diary_emotion에 저장
            diary.setDiaryImg(imageUrl); // diary_img에 저장

//            String formattedDate = nowSeoul.toLocalDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")); //생성시간 구하기
            diary.setDiaryDate(formattedDate); //diary_date에 저장
            diaryRepository.save(diary);

            return "제목: " + diaryTitle + "\n내용: " + diaryContent + "\n날짜: " + formattedDate;

        } catch (Exception e) {
            e.printStackTrace();
            return "일기 생성에 실패했어요....:(";
        }

    }
    private String callGptApi(String inputs, String prompt) throws Exception {
        JSONArray messagesArray = new JSONArray();
        messagesArray.put(new JSONObject().put("role", "system").put("content", prompt));
        messagesArray.put(new JSONObject().put("role", "user").put("content", inputs));

        JSONObject jsonBody = new JSONObject();
        jsonBody.put("messages", messagesArray);
        jsonBody.put("max_tokens", 1000);
        jsonBody.put("n", 1);
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

        JSONObject jsonResponse = new JSONObject(responseBody);
        JSONArray choices = jsonResponse.getJSONArray("choices");
        if (choices.length() > 0) {
            JSONObject firstChoice = choices.getJSONObject(0);
            JSONObject message = firstChoice.getJSONObject("message");
            return message.getString("content"); // GPT로부터 생성된 일기 내용 반환
        } else {
            return "GPT생성 API 호출에 실패했어요... :(";
        }
    }
    private String generateImage(String prompt) throws Exception {
        JSONObject jsonBody = new JSONObject();
        jsonBody.put("prompt", prompt);
        jsonBody.put("n", 1);
        jsonBody.put("size", "512x512");

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/images/generations"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + API_KEY)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody.toString()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();

        JSONObject jsonResponse = new JSONObject(responseBody);
        JSONArray data = jsonResponse.getJSONArray("data");
        if (data.length() > 0) {
            JSONObject firstImage = data.getJSONObject(0);

            System.out.println(firstImage.getString("url"));
            return firstImage.getString("url"); // DALL-E로부터 생성된 이미지 URL 반환
        } else {
            throw new Exception("이미지 생성 API 호출에 실패했어요...");
        }
    }

    public static String encodeToBase64(String fillImageUrl, int targetWidth, int targetHeight) throws IOException {
        URL url = new URL(fillImageUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        // 이미지 다운로드
        InputStream inputStream = connection.getInputStream();
        BufferedImage originalImage = ImageIO.read(inputStream);
        inputStream.close();
        connection.disconnect();

        // 이미지 리사이징
        Image resizedImage = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);
        BufferedImage bufferedResizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = bufferedResizedImage.createGraphics();
        g2d.drawImage(resizedImage, 0, 0, null);
        g2d.dispose();

        // 이미지를 base64로 인코딩
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedResizedImage, "jpg", baos);
        byte[] imageBytes = baos.toByteArray();
        String base64EncodedImage = Base64.getEncoder().encodeToString(imageBytes);

        return base64EncodedImage;
    }
}
