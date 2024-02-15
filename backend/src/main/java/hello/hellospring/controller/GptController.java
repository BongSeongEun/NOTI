package hello.hellospring.controller;

import hello.hellospring.dto.ChatDTO;
import hello.hellospring.model.Chat;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.service.GptService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/ask")
    public String ask(@RequestBody Map<String, String> request) {

        Long userId = Long.parseLong(request.get("user_id")); // userId 입력받음
        String userMessage = request.get("chat_content"); // chat_content 입력받음
        boolean chatRole = Boolean.parseBoolean(request.get("chat_role")); // chat_role 입력받음

        // ChatDTO 생성 및 chatContent 설정
        ChatDTO chatDTO = new ChatDTO();

        chatDTO.setUserId(userId);
        chatDTO.setChatContent(userMessage);
        chatDTO.setChatRole(chatRole);

        // ChatDTO를 Chat 엔티티로 변환
        Chat chat = Chat.toSaveEntity(chatDTO);
        // Chat 엔티티를 데이터베이스에 저장
        chatRepository.save(chat);


        try {
            return gptService.askGpt(userMessage);
        } catch (Exception e) {
            e.printStackTrace();
            return "GPT API 호출 오류가 발생했어요 :(";
        }
    }

}
