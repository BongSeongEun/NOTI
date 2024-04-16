package hello.hellospring.dto;


import hello.hellospring.model.Goal;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class GoalDTO {
    private Long goalId;
    private Long userId;
    private String goalDate;
    private String goalTitle;
    private Long goalTime;
    private Long goalAchieveRate;

    public static GoalDTO goalDTO(Goal goal){
        GoalDTO goalDTO = new GoalDTO();
        goalDTO.setGoalId(goal.getGoalId());
        goalDTO.setUserId(goal.getUserId());
        goalDTO.setGoalDate(goalDTO.getGoalDate());
        goalDTO.setGoalTitle(goal.getGoalTitle());
        goalDTO.setGoalTime(goal.getGoalTime());
        goalDTO.setGoalAchieveRate(goal.getGoalAchieveRate());
        return goalDTO;
    }
}
