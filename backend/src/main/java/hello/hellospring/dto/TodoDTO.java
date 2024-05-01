package hello.hellospring.dto;

import hello.hellospring.Exception.AppException;
import hello.hellospring.Exception.ErrorCode;
import hello.hellospring.model.Todo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoDTO {

    private Long todoId;
    private Long userId;
    private String todoTitle;
    private String todoStartTime;
    private String todoEndTime;
    private String todoColor;
    private boolean todoDone;
    private String todoDate;
    private String todoTag;

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
                .todoTag(dto.getTodoTag())
                .build();
    }
    public static TodoDTO from(Todo todo) {
        return TodoDTO.builder()
                .todoId(todo.getTodoId())
                .userId(todo.getUserId())
                .todoTitle(todo.getTodoTitle())
                .todoStartTime(todo.getTodoStartTime())
                .todoEndTime(todo.getTodoEndTime())
                .todoColor(todo.getTodoColor())
                .todoDone(todo.isTodoDone())
                .todoDate(todo.getTodoDate())
                .todoTag(todo.getTodoTag())
                .build();
    }

}
