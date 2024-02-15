package hello.hellospring.model;

import hello.hellospring.dto.ChatDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@Table(name = "chat")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "chat_date")
    private String chatDate;

    @Column(name = "chat_content")
    private String chatContent;

    @Column(name = "chat_who")
    private boolean chatWho;

    @Column(name = "chat_role")
    private boolean chatRole;

    @Column(name = "work_chat_event")
    private String workChatEvent;

    @Column(name = "work_chat_time")
    private String workChatTime;

    public static Chat toSaveEntity(ChatDTO chatDTO){
        Chat chat = new Chat();
        chat.setChatId(chatDTO.getChatId());
        chat.setUserId(chatDTO.getUserId());
        chat.setChatDate(chatDTO.getChatDate());
        chat.setChatContent(chatDTO.getChatContent());
        chat.setChatWho(chatDTO.isChatWho());
        chat.setChatRole(chatDTO.isChatRole());
        chat.setWorkChatEvent(chatDTO.getWorkChatEvent());
        chat.setWorkChatTime(chatDTO.getWorkChatTime());
        return chat;
    }

    public static Chat toUdateEntity(ChatDTO chatDTO){ 
        Chat chat = new Chat();
        chat.setChatId(chatDTO.getChatId());
        chat.setUserId(chatDTO.getUserId());
        chat.setChatDate(chatDTO.getChatDate());
        chat.setChatContent(chatDTO.getChatContent());
        chat.setChatWho(chatDTO.isChatWho());
        chat.setChatRole(chatDTO.isChatRole());
        chat.setWorkChatEvent(chatDTO.getWorkChatEvent());
        chat.setWorkChatTime(chatDTO.getWorkChatTime());
        return chat;

    }











}
