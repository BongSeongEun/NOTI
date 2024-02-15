package hello.hellospring.controller;

import hello.hellospring.dto.ChatDTO;
import hello.hellospring.model.Chat;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.service.GptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class GptController {

    private final GptService gptService; //service 참조
    private final ChatRepository chatRepository; // repository 참조

    @Autowired
    public GptController(GptService gptService, ChatRepository chatRepository) {

        this.gptService = gptService;
        this.chatRepository = chatRepository;
    }

    @PostMapping("/ask/{userId}")
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
            return "GPT API 호출 오류가 발생했습니다.";
        }

    }

}
