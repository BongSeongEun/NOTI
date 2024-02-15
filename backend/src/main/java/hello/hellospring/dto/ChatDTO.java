package hello.hellospring.dto;

import hello.hellospring.model.Chat;
import hello.hellospring.model.Diary;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class ChatDTO {
    private Long chatId;
    private Long userId;
    private String chatDate;
    private String chatContent;
    private boolean chatWho;
    private boolean chatRole;
    private String workChatEvent;
    private String workChatTime;

    public static ChatDTO chatDTO(Chat chat){
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setChatId(chat.getChatId());
        chatDTO.setUserId(chat.getUserId());
        chatDTO.setChatDate(chat.getChatDate());
        chatDTO.setChatContent(chat.getChatContent());
        chatDTO.setChatWho(chat.isChatWho());
        chatDTO.setChatRole(chat.isChatRole());
        chatDTO.setWorkChatEvent(chat.getWorkChatEvent());
        chatDTO.setWorkChatTime(chat.getWorkChatTime());
        return chatDTO;
    }
}
