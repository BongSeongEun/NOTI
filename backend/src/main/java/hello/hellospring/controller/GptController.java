package hello.hellospring.controller;

import hello.hellospring.dto.ChatDTO;
import hello.hellospring.model.Chat;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.service.GptDiaryService;
import hello.hellospring.service.GptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class GptController {

    private final GptService gptService; //service 참조
    private final GptDiaryService gptDiaryService; // service 참조2
    private final ChatRepository chatRepository; // repository 참조


    @Autowired
    public GptController(GptService gptService, ChatRepository chatRepository, GptDiaryService gptDiaryService) {

        this.gptService = gptService;
        this.chatRepository = chatRepository;
        this.gptDiaryService = gptDiaryService;
    }

    @PostMapping("/api/v3/ask/{userId}") //채팅보내기 및 gpt답변호출
    public String ask(@PathVariable Long userId, @RequestBody Map<String, String> request) {

        //Long userId = Long.parseLong(request.get("user_id")); // userId 입력받음
        String userMessage = request.get("chat_content"); // chat_content 입력받음
        boolean chatRole = Boolean.parseBoolean(request.get("chat_role")); // chat_role 입력받음

        // 첫 번째 Chat 엔티티를 생성하고 데이터베이스에 저장 (클라이언트가 보낸 메시지)
        ChatDTO initialChatDTO = new ChatDTO(null, userId, null, userMessage, false, chatRole, null, null);
        Chat initialChat = Chat.toSaveEntity(initialChatDTO);
        chatRepository.save(initialChat);

        try {
            // GPT 서비스를 호출하여 응답 받기
            String gptResponse = gptService.askGpt(userMessage);

            // GPT 응답을 새로운 Chat 엔티티의 chat_content로 설정하고 데이터베이스에 저장
            ChatDTO responseChatDTO = new ChatDTO(null, userId, null, gptResponse, true, chatRole, null, null);
            Chat responseChat = Chat.toSaveEntity(responseChatDTO);
            chatRepository.save(responseChat);

            // GPT 응답을 클라이언트에 반환
            return gptResponse;
        } catch (Exception e) {
            e.printStackTrace();
            return "GPT API 호출 오류가 발생했어요... ㅠ3ㅠ 아마.. API KEY가 잘못입력된 것 같아요..!!";
        }

    }

    @GetMapping("/api/v3/chatlist/{userId}") // 채팅내역 가져오기
    public List<Chat> getChatListByUserId(@PathVariable Long userId) {
        return chatRepository.findByUserId(userId);
    }

    @GetMapping("/api/v3/createDiary/{userId}")
    public String createDiary(@PathVariable Long userId){
        try {
            // userId에 해당하는 chatContent들로 일기 생성
            return gptDiaryService.createDiary(userId);
        } catch (Exception e){
            e.printStackTrace();
            return "일기 생성 중 오류가 발생했어요... :(";
        }

    }





}
