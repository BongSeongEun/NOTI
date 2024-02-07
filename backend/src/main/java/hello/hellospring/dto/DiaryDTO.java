package hello.hellospring.dto;

// DTO : 데이터를 전송할때 사용하는 객체

import hello.hellospring.model.Diary;
import lombok.*;
import org.springframework.web.bind.annotation.GetMapping;

@Getter // 각각의 메서드 get
@Setter // 각각의 메서드 set
@ToString // 필드값 확인시
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 하는 생성자

public class DiaryDTO {
    private Long diaryId;
    private Long userId;
    private String diaryDate;
    private String diaryContent;
    private String diaryImg;
    private String diaryTitle;

    public static DiaryDTO diaryDTO(Diary diary){
        DiaryDTO diaryDTO = new DiaryDTO();
        diaryDTO.setDiaryId(diary.getDiaryId());
        diaryDTO.setUserId(diary.getUserId());
        diaryDTO.setDiaryDate(diary.getDiaryDate());
        diaryDTO.setDiaryContent(diary.getDiaryContent());
        diaryDTO.setDiaryImg(diary.getDiaryImg());
        diaryDTO.setDiaryTitle(diary.getDiaryTitle());
        return diaryDTO;
    }

}
