package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "Todo")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "todo_id")
    private Long todoId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "todo_title")
    private String todoTitle;

    @Column(name = "todo_start_time")
    private String todoStartTime;

    @Column(name = "todo_end_time")
    private String todoEndTime;

    @Column(name = "todo_done")
    private boolean todoDone;

    @Column(name = "todo_color")
    private String todoColor;

    @Column(name = "todo_date")
    private  String todoDate;

    @Builder
    public Todo(Long todoId, Long userId, String todoTitle, String todoStartTime, String todoEndTime, String todoColor, Boolean todoDone, String todoDate){
        this.todoId = todoId;
        this.userId = userId;
        this.todoTitle = todoTitle;
        this.todoStartTime = todoStartTime;
        this.todoEndTime = todoEndTime;
        this.todoColor = todoColor;
        this.todoDone = todoDone;
        this.todoDate = todoDate;
    }


}
