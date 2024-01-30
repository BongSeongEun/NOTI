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

    private Long todoId;
    private Long userId;
    private String todoTitle;
    private String todoStartTime;
    private String todoEndTime;
    private String todoColor;
    private boolean todoDone;
    private String todoDate;

    public TodoDTO(final Todo todo){
        this.todoId = todo.getTodoId();
        this.userId = todo.getUserId();
        this.todoTitle = todo.getTodoTitle();
        this.todoStartTime = todo.getTodoStartTime();
        this.todoEndTime = todo.getTodoEndTime();
        this.todoColor = todo.getTodoColor();
        this.todoDone = todo.isTodoDone();
        this.todoDate = todo.getTodoDate();
    }

    public static Todo toEntity(final TodoDTO dto){
        if(dto.getTodoTitle()==null || dto.getTodoTitle().equals("")){
            throw new AppException(ErrorCode.NO_TITLE_ENTERED);
        }

        return Todo.builder()
                .todoId(dto.getTodoId())
                .userId(dto.getUserId())
                .todoTitle(dto.getTodoTitle())
                .todoStartTime(dto.getTodoStartTime())
                .todoEndTime(dto.getTodoEndTime())
                .todoColor(dto.getTodoColor())
                .todoDone(dto.isTodoDone())
                .todoDate(dto.getTodoDate())
                .build();
    }
}
