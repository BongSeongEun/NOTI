package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "diary")
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")
    private Long diaryId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "diary_date")
    private Long diaryDate;

    @Column(name = "diary_content")
    private String diaryContent;

    @Builder
    public Diary(Long userId, Long diaryDate, String diaryContent){
        this.userId = userId;
        this.diaryDate = diaryDate;
        this.diaryContent = diaryContent;
    }
}