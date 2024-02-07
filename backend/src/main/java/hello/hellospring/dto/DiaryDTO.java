package hello.hellospring.dto;

// DTO : 데이터를 전송할때 사용하는 객체

import lombok.*;
import org.springframework.web.bind.annotation.GetMapping;

@Getter // 각각의 메서드 get
@Setter // 각각의 메서드 set
@ToString // 필드값 확인시
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 하는 생성자

public class DiaryDTO {
    private Long diaryId;
    private String diaryDate;
    private Long userId;
    private String diaryContent;
    private String diaryImg;

}
