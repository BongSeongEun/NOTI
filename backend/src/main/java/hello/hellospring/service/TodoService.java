package hello.hellospring.service;

import hello.hellospring.Exception.AppException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Goal;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.GoalRepository;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.AI.GptGoalService;
import hello.hellospring.service.AI.GptTagService;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONTokener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

import static hello.hellospring.Exception.ErrorCode.NO_TITLE_ENTERED;

@Service
public class TodoService {

    private final GptTagService gptTagService;
    private final TodoRepository todoRepository;
    private final GoalRepository goalRepository;
    private final GptGoalService gptGoalService;
    @Autowired
    public TodoService(GptTagService gptTagService,
                       TodoRepository todoRepository,
                       GoalRepository goalRepository,
                       GptGoalService gptGoalService) {
        this.gptTagService = gptTagService;
        this.todoRepository = todoRepository;
        this.goalRepository = goalRepository;
        this.gptGoalService = gptGoalService;
    }
    public List<Todo> createTodo(Todo todo){
        validateEmptyTodoTile(todo);
        todoRepository.save(todo);

        return todoRepository.findByUserId(todo.getUserId());
    }

    public Todo update(TodoDTO todoDTO, Long userId, Long todoId) {
        Todo originalTodo = todoRepository.findByTodoIdAndUserId(todoId, userId);

        originalTodo.setTodoTitle(todoDTO.getTodoTitle());
        originalTodo.setTodoStartTime(todoDTO.getTodoStartTime());
        originalTodo.setTodoEndTime(todoDTO.getTodoEndTime());
        originalTodo.setTodoColor(todoDTO.getTodoColor());
        originalTodo.setTodoDone(todoDTO.isTodoDone());
        originalTodo.setTodoDate(todoDTO.getTodoDate());

        todoRepository.save(originalTodo);

        return originalTodo;
    }

    public List<Todo> getTodo(String userId){
        return todoRepository.findByUserId(Long.valueOf(userId));
    }

    @Transactional
    public List<Todo> delete(String userId, String todoId){
            todoRepository.deleteByTodoIdAndUserId(Long.valueOf(todoId), Long.valueOf(userId));
        return getTodo(userId);
    }


    private void validateEmptyTodoTile(Todo todo) {
        if (todo.getTodoTitle().equals("") || todo.getTodoTitle() == null) {
            throw new AppException(NO_TITLE_ENTERED);
        }
    }

    public int completedTodos(Long userId, String month) {
        List<Todo> allTodos = todoRepository.findAllTodosByMonthAndUserId(userId, month);
        List<Todo> completedTodos = todoRepository.findCompletedTodosByMonthAndUserId(userId, month);

        // 모든 일정의 수
        int totalTodos = allTodos.size();
        // 완료된 일정의 수
        int completedTodosCount = completedTodos.size();

        // 모든 일정 중에서 달성한 일정의 비율 계산
        double completionRate = 0;
        if (totalTodos > 0) { // 분모가 0이 되는 경우를 방지
            completionRate = ((double) completedTodosCount / totalTodos) * 100;
        }

        System.out.println("이번달 일정 :" + totalTodos);
        System.out.println("일정 중 달성갯수 :" + completedTodosCount);

        return (int) completionRate;
    }

    public void updateTodoTags(Long userId, String statsDate) {
        String formattedDate = statsDate + "%";
        List<Todo> todos = todoRepository.findByUserIdAndTodoDateLikeAndTodoTagIsNull(userId, formattedDate);

        // todos 리스트가 비어 있지 않은 경우에만 처리
        if (todos != null && !todos.isEmpty()) {
            todos.forEach(todo -> {
                String tag = null; // 서비스 호출
                try {
                    tag = gptTagService.askGpt(todo.getTodoTitle());
                } catch (Exception e) {
                    System.err.println("이 문구가 뜨면.. gpt가 터진거에요..: " + todo.getTodoId() + " - " + e.getMessage());
                }
                todo.setTodoTag(tag);
                todoRepository.save(todo); // 태그 저장
            });
        } else {
            // todos 리스트가 비어 있는 경우
            System.out.println("태그화 다 성공~!!" + userId + ", " + statsDate);
        }
    }

    public Map<String, Object> findWords(Long userId, String statsDate) {
        // 단순 일정의 총 개수 구하는 로직
        List<Todo> allTodos = todoRepository.findAllTodosByMonthAndUserId(userId, statsDate);
        int totalTodos = allTodos.size();

        List<String> todoTags = todoRepository.findAllTodoTagsByUserIdAndStatsDate(userId, statsDate);
        Map<String, Long> wordFrequency = new HashMap<>();

        // ',' 기준으로 단어 분리 및 "없음" 단어 제외 후 빈도수 계산
        todoTags.forEach(tags -> Arrays.stream(tags.split(","))
                .map(String::trim) // 공백 제거
                .filter(word -> !word.equalsIgnoreCase("없음")) // "없음" 단어 제외
                .forEach(word -> wordFrequency.put(word, wordFrequency.getOrDefault(word, 0L) + 1)));

        // 빈도수 내림차순으로 정렬 후 상위 4개 단어와 빈도수 추출
        List<Map.Entry<String, Long>> sortedEntries = wordFrequency.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(4)
                .collect(Collectors.toList());

        // 상위 네 단어와 빈도수를 JSON 형태로 매핑
        Map<String, Object> result = new LinkedHashMap<>();
        int rank = 1;
        long etc = 0;
        long etcNum = 0;
        long etcTime = 0;

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm"); // 문자열 날짜 포맷 정의

        long totalDurationAllTodos = allTodos.stream()
                .filter(todo -> todo.getTodoEndTime() != null && todo.getTodoStartTime() != null)
                .filter(todo -> isValidTimeFormat(todo.getTodoStartTime(), timeFormatter) && isValidTimeFormat(todo.getTodoEndTime(), timeFormatter))
                .mapToLong(todo -> {
                    LocalTime startTime = LocalTime.parse(todo.getTodoStartTime(), timeFormatter);
                    LocalTime endTime = LocalTime.parse(todo.getTodoEndTime(), timeFormatter);
                    Duration duration = Duration.between(startTime, endTime);
                    return duration.isNegative() ? duration.plusDays(1).toMinutes() : duration.toMinutes();
                })
                .sum();

        for (Map.Entry<String, Long> entry : sortedEntries) {

            //몇개중에 몇개달성했어요 용도
            List<Todo> todosDone = todoRepository.findAllByUserIdAndStatsDateAndTodoTagAndTodoDone(userId, statsDate, entry.getKey(), true);
            // 태그마다 총 시간 출력 용도
            List<Todo> todosWithTag = todoRepository.findAllByUserIdAndStatsDateAndTag(userId, statsDate, entry.getKey());
            long totalDurationMinutes = todosWithTag.stream()
                    .filter(todo -> todo.getTodoEndTime() != null && todo.getTodoStartTime() != null)
                    .filter(todo -> isValidTimeFormat(todo.getTodoStartTime(), timeFormatter) && isValidTimeFormat(todo.getTodoEndTime(), timeFormatter))
                    .mapToLong(todo -> {
                        LocalTime startTime = LocalTime.parse(todo.getTodoStartTime(), timeFormatter);
                        LocalTime endTime = LocalTime.parse(todo.getTodoEndTime(), timeFormatter);
                        Duration duration = Duration.between(startTime, endTime);
                        return duration.isNegative() ? duration.plusDays(1).toMinutes() : duration.toMinutes();
                    })
                    .sum();

            int frequencyPercentage = (int) Math.round(((double) entry.getValue() / totalTodos) * 100);
            result.put("Word"+rank+"st", entry.getKey()); // 태그 이름
            result.put("Word"+rank+"stNum", entry.getValue()); // 태그 갯수
            result.put("Word"+rank+"stDoneTodos", todosDone.size()); // 태그 완료 갯수
            result.put("Word"+rank+"stPercent", frequencyPercentage); // 태그 퍼센트
            result.put("Word"+rank+"stTime", totalDurationMinutes); // 태그 달성시간
            etc += frequencyPercentage; //기타 퍼센트 계산
            etcNum += entry.getValue();  //기타 갯수 계산
            etcTime += totalDurationMinutes; //기타 시간 계산
            rank++;
        }
        long etcResult = 100 - etc; // 그외 퍼센트 계산
        long etcNumResult = totalTodos - etcNum; // 그외 갯수 계산
        long etcTimeResult = totalDurationAllTodos - etcTime;
        result.put("etcPercent", etcResult);
        result.put("etcNum", etcNumResult);
        result.put("etcTime", etcTimeResult);
        System.out.println("totalTodos는 : "+totalTodos);

        return result;
    }

    private boolean isValidTimeFormat(String timeStr, DateTimeFormatter formatter) {
        try {
            LocalTime.parse(timeStr, formatter);
            return true;
        } catch (DateTimeParseException e) {
            return false; // 문자열이 유효한 시간 포맷이 아니면 false 반환
        }
    }


    public Map<String, Long> findWeekDay(Long userId, String statsDate) {
        List<Todo> allTodos = todoRepository.findAllTodosByMonthAndUserId(userId, statsDate);
        List<Todo> doneTodos = todoRepository.findAllTodosByMonthAndUserIdAndTodoDone(userId, statsDate, true);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        LocalDate startOfMonth = LocalDate.parse(statsDate + ".01", formatter);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        Map<String, List<String>> weekDaysMap = new HashMap<>();
        weekDaysMap.put("MONDAY", new ArrayList<>());
        weekDaysMap.put("TUESDAY", new ArrayList<>());
        weekDaysMap.put("WEDNESDAY", new ArrayList<>());
        weekDaysMap.put("THURSDAY", new ArrayList<>());
        weekDaysMap.put("FRIDAY", new ArrayList<>());
        weekDaysMap.put("SATURDAY", new ArrayList<>());
        weekDaysMap.put("SUNDAY", new ArrayList<>());

        Map<String, Long> result = new HashMap<>();
        for (LocalDate date = startOfMonth; !date.isAfter(endOfMonth); date = date.plusDays(1)) {
            String dayOfWeek = date.getDayOfWeek().toString();
            weekDaysMap.get(dayOfWeek).add(date.format(formatter));
        }

        // 일정 개수와 달성 일정 개수 계산하여 결과 맵에 저장
        weekDaysMap.forEach((dayOfWeek, dates) -> {
            long totalTodosCount = allTodos.stream()
                    .filter(todo -> dates.contains(todo.getTodoDate()))
                    .count();
            long doneTodosCount = doneTodos.stream()
                    .filter(todo -> dates.contains(todo.getTodoDate()))
                    .count();

            // 결과 맵에 요일별로 저장
            String prefix = dayOfWeek.substring(0, 3).toUpperCase();
            result.put(prefix + "doneTodos", doneTodosCount);
            result.put(prefix + "totalTodos", totalTodosCount);
        });

        return result;
    }

    public Map<String, Object> getGoal(Long userId, String statsDate) throws Exception {



        List<Goal> GoalExist = goalRepository.findByUserIdAndStatsDate(userId, statsDate);
        // 목표가 이미 존재하는지 아닌지 확인하는 로직
        Map<String, Object> response = null;
        if (GoalExist.isEmpty()) {
            // 해당하는 달의 목표가 존재하지 않음
            System.out.println("비었다");

            // gpt에게 추천받기
            String goalResult = gptGoalService.askGpt(null);

            response = new HashMap<>();
            response.put("GptSuggest", goalResult);

        } else {
            // 해당하는 달의 목표가 존재함
            System.out.println("있다");

            Map<String, Object> wordsResult = findWords(userId, statsDate);
            String wordsResultText = formatWordsResult(wordsResult);

            // gpt에게 추천받기
            String goalResult = gptGoalService.askGpt(wordsResultText);
            String goalReResult = removeNewLines(goalResult); // \n제거

            //결과물 response에 추가
            parseGoalResult(goalReResult, response);

            response = new HashMap<>();
            for (Goal goal : GoalExist) {
                response.put("goalTitle", goal.getGoalTitle()); // 기존 목표 제목
                response.put("goalTime", goal.getGoalTime()); // 기존 목표 시간
                response.put("goalAchieveRate", goal.getGoalAchieveRate()); // 기존 목표 달성률
            }
        }
        return response;
    }

    private void parseGoalResult(String goalResult, Map<String, Object> response) {
        try {
            Object json = new JSONTokener(goalResult).nextValue(); // JSON 데이터의 타입을 동적으로 확인
            if (!(json instanceof JSONArray)) {
                response.put("error", "Invalid JSON format: Root element is not an array.");
                return;
            }

            JSONArray mainArray = (JSONArray) json;

            if (mainArray.length() != 3 || !(mainArray.get(0) instanceof JSONArray)) {
                response.put("error", "Expected three arrays at the root of the JSON structure.");
                return;
            }

            JSONArray titles = mainArray.getJSONArray(0);
            JSONArray rates = mainArray.getJSONArray(1);
            JSONArray times = mainArray.getJSONArray(2);

            // 세 배열의 길이 검증
            int minLength = Math.min(titles.length(), Math.min(rates.length(), times.length()));
            for (int i = 0; i < minLength; i++) {
                String title = titles.optString(i, "N/A");
                int rate = rates.optInt(i, 0);
                int time = times.optInt(i, 0);

                response.put("suggestGoalTitle" + (i+1), title);
                response.put("suggestGoalAchieveRate" + (i+1), rate);
                response.put("suggestGoalTime" + (i+1), time);
            }
        } catch (JSONException e) {
            response.put("error", "JSON parsing error: " + e.getMessage());
        }
    }


    //gpt로 보내기 전에 prompt 정리하는 로직 (포맷팅)
    private String formatWordsResult(Map<String, Object> wordsResult) {
        StringBuilder resultText = new StringBuilder();
        for (Map.Entry<String, Object> entry : wordsResult.entrySet()) {
            resultText.append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
        }
        return resultText.toString();
    }

    // \n제거 로직
    private String removeNewLines(String input) {
        if (input != null) {
            return input.replace("\n", ",");
        }
        return input;
    }

}
