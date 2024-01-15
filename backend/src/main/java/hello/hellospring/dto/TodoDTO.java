package hello.hellospring.dto;

import hello.hellospring.Exception.AppException;
import hello.hellospring.Exception.ErrorCode;
import hello.hellospring.model.Todo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TodoDTO {

    private String id;
    private String title;
    private boolean done;
    private String time;
    private String userCode;

    public TodoDTO(final Todo todo){
        this.id = todo.getId();
        this.title = todo.getTitle();
        this.done = todo.isDone();
        this.time = todo.getTime();
        this.userCode = todo.getUserCode();
    }

    public static Todo toEntity(final TodoDTO dto){
        if(dto.getTitle()==null || dto.getTitle().equals("")){
            throw new AppException(ErrorCode.NO_TITLE_ENTERED);
        }
        if(dto.getTime()==null || dto.getTime().equals("")){
            throw new AppException(ErrorCode.NO_TIME_ENTERED);
        }
        return Todo.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .done(dto.isDone())
                .time(dto.getTime())
                .userCode(dto.getUserCode())
                .build();
    }
}
