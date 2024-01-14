package hello.hellospring.Exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException{
    private ErrorCode errorCode;
    private String detailMessage;

    public AppException(ErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.detailMessage = errorCode.getMessage();
    }
    public AppException(ErrorCode errorCode, String detailMessage){
        super(detailMessage);
        this.errorCode = errorCode;
        this.detailMessage = detailMessage;
    }
}
