package hello.hellospring.model;

import hello.hellospring.dto.DiaryDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
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
    private String diaryDate;

    @Column(name = "diary_content")
    private String diaryContent;

    @Column(name = "diary_img")
    private String diaryImg;

    //모든 값을 여기로 담아와서 전달해줌
    public static Diary toSaveEntity(DiaryDTO diaryDTO){
        Diary diary = new Diary();
        diary.setDiaryId(diaryDTO.getDiaryId());
        diary.setUserId(diaryDTO.getUserId());
        diary.setDiaryDate(diaryDTO.getDiaryDate());
        diary.setDiaryContent(diaryDTO.getDiaryContent());
        diary.setDiaryImg(diaryDTO.getDiaryImg());
        return diary;
    }



    @Builder
    public Diary(Long userId, String diaryDate, String diaryContent, String diaryImg){
        this.userId = userId;
        this.diaryDate = diaryDate;
        this.diaryContent = diaryContent;
        this.diaryImg = diaryImg;
    }
}
