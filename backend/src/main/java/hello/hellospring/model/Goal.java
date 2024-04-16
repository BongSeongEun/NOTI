package hello.hellospring.model;

import hello.hellospring.dto.GoalDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@Table(name = "goal")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long goalId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "goal_date")
    private String goalDate;

    @Column(name = "goal_title")
    private String goalTitle;

    @Column(name = "goal_time")
    private Long goalTime;

    @Column(name = "goal_achieve_rate")
    private Long goalAchieveRate;

    public static Goal toSaveEntity(GoalDTO goalDTO){
        Goal goal = new Goal();
        goal.setGoalId(goalDTO.getGoalId());
        goal.setUserId(goalDTO.getUserId());
        goal.setGoalDate(goalDTO.getGoalDate());
        goal.setGoalTitle(goalDTO.getGoalTitle());
        goal.setGoalTime(goalDTO.getGoalTime());
        goal.setGoalAchieveRate(goalDTO.getGoalAchieveRate());
        return goal;
    }

    public static Goal toUpdateEntity(GoalDTO goalDTO){
        Goal goal = new Goal();
        goal.setGoalId(goalDTO.getGoalId());
        goal.setUserId(goalDTO.getUserId());
        goal.setGoalDate(goalDTO.getGoalDate());
        goal.setGoalTitle(goalDTO.getGoalTitle());
        goal.setGoalTime(goalDTO.getGoalTime());
        goal.setGoalAchieveRate(goalDTO.getGoalAchieveRate());
        return goal;
    }



}

