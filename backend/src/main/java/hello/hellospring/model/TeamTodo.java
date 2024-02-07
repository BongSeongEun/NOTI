package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team_todo")
public class TeamTodo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_todo_id")
    private Long teamTodoId;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "team_todo_done")
    private boolean teamTodoDone;

    @Column(name = "team_todo_title")
    private String teamTodoTitle;

    @Column(name = "team_todo_date")
    private String teamTodoDate;


    @Builder
    public TeamTodo(Long teamTodoId, Long teamId, boolean teamTodoDone, Long userId, String teamTodoTitle, String teamTodoDate){
        this.teamTodoId = teamTodoId;
        this.teamId = teamId;
        this.teamTodoDone = teamTodoDone;
        this.userId = userId;
        this.teamTodoTitle = teamTodoTitle;
        this.teamTodoDate = teamTodoDate;
    }

}
