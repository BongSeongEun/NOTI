package hello.hellospring.model;

import hello.hellospring.dto.ChatDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

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
    private LocalDateTime chatDate;

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

    @PrePersist
    public void prePersist() {
        this.chatDate = LocalDateTime.now(); // 현재 시간으로 설정
    }

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

    public static Chat toUpdateEntity(ChatDTO chatDTO){
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
