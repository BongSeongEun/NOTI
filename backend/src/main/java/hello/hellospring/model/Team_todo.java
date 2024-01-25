package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "team_todo")
public class Team_todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_todo_id")
    private Long teamTodoId;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "team_todo_done")
    private boolean teamTodoDone;

    @Column(name = "team_todo_color")
    private String teamTodoColor;

    @Column(name = "team_todo_title")
    private String teamTodoTitle;

    @Builder
    public Team_todo(Long teamTodoId, Long teamId, boolean teamTodoDone, String teamTodoColor, String teamTodoTitle){
        this.teamTodoId = teamTodoId;
        this.teamId = teamId;
        this.teamTodoDone = teamTodoDone;
        this.teamTodoColor = teamTodoColor;
        this.teamTodoTitle = teamTodoTitle;
    }

}
