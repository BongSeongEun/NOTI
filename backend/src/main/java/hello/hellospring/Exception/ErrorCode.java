package hello.hellospring.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    NO_TIME_ENTERED("시간을 입력해주세요!"),
    NO_TITLE_ENTERED("제목을 입력해주세요!");

    private final String message;
}
