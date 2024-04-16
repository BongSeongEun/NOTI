package hello.hellospring.controller;

import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v4")
public class StatisticsController {

    private final TodoRepository todoRepository;
    private final TodoService todoService;


    @Autowired
    public StatisticsController(TodoRepository todoRepository, TodoService todoService) {

        this.todoRepository = todoRepository;
        this.todoService = todoService;
    }

    @GetMapping("/statsMonth/{userId}/{statsDate}") // 이번달 달성률 %, (입력한 기준으로) 저번달 달성률 %, 두달 동안 비교
    public ResponseEntity<?> getCompletedTodosCount(@PathVariable Long userId, @PathVariable String statsDate) {
        int thisMonth = todoService.completedTodos(userId, statsDate);

        // 저번달 계산 로직
        DateTimeFormatter parseFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd"); // 날짜 파싱을 위한 포맷터
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy.MM"); // 날짜 출력을 위한 포맷터
        LocalDate date = LocalDate.parse(statsDate + ".01", parseFormatter); // statsDate에서 LocalDate 객체를 생성
        LocalDate prevMonthDate = date.minusMonths(1); // 이전 달의 LocalDate 객체를 계산
        String prevMonthStatsDate = prevMonthDate.format(outputFormatter); // 이전 달을 "YYYY.MM" 형식으로 변환

        int prevMonth = todoService.completedTodos(userId, prevMonthStatsDate);

        int difference = thisMonth - prevMonth;


        Map<String, Object> response = new HashMap<>();
        response.put("thisMonth", thisMonth);
        response.put("prevMonth", prevMonth);
        response.put("difference", difference);

        return ResponseEntity.ok(response);
    }

    @GetMapping("statsTag/{userId}/{statsDate}") // 해당하는 달에 가장많이 나온 태그 & 퍼센트
    public ResponseEntity<?> getTagTodos(@PathVariable Long userId, @PathVariable String statsDate){

        todoService.updateTodoTags(userId, statsDate);

        Map<String, Object> topFourWords = todoService.findWords(userId, statsDate);
        return ResponseEntity.ok(topFourWords);

    }

    @GetMapping("dayWeek/{userId}/{statsDate}") // 요일마다 달성률
    public ResponseEntity<?> getDayWeek(@PathVariable Long userId, @PathVariable String statsDate){

        Map<String, Long> dayWeeks = todoService.findWeekDay(userId, statsDate);
        return ResponseEntity.ok(dayWeeks);

    }
    @GetMapping("suggestGoal/{userId}/{statsDate}") // 목표 없을때 제시
    public ResponseEntity<?> getGoal(@PathVariable Long userId, @PathVariable String statsDate) throws Exception {

        Map<String, Object> monthGoal = todoService.getGoal(userId, statsDate);
        return ResponseEntity.ok(monthGoal);

    }

    @PostMapping("GoalWrite/{userId}/{statsDate}")
    public ResponseEntity<?> GoalWrite(@PathVariable Long userId, @PathVariable String statsDate) throws Exception {
        return null;

    }


}

