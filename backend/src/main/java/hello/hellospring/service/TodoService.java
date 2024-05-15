package hello.hellospring.service;

import hello.hellospring.Exception.AppException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Goal;
import hello.hellospring.model.Summary;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.GoalRepository;
import hello.hellospring.repository.SummaryRepository;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.AI.GptGoalService;
import hello.hellospring.service.AI.GptSummaryService;
import hello.hellospring.service.AI.GptTagService;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
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
    private final GptSummaryService gptSummaryService;
    private final SummaryRepository summaryRepository;
    @Autowired
    public TodoService(GptTagService gptTagService,
                       TodoRepository todoRepository,
                       GoalRepository goalRepository,
                       GptGoalService gptGoalService,
                       GptSummaryService gptSummaryService, SummaryRepository summaryRepository) {
        this.gptTagService = gptTagService;
        this.todoRepository = todoRepository;
        this.goalRepository = goalRepository;
        this.gptGoalService = gptGoalService;
        this.gptSummaryService = gptSummaryService;
        this.summaryRepository = summaryRepository;
    }
    public List<Todo> createTodo(Todo todo) {
        validateEmptyTodoTile(todo);
        todoRepository.save(todo);

        String tag = null;
        try {
            tag = gptTagService.askGpt(todo.getTodoTitle(), todo.getUserId());
        } catch (Exception e) {
            System.err.println("이 문구가 뜨면.. gpt가 터진거에요..: " + todo.getTodoId() + " - " + e.getMessage());
        }
        todo.setTodoTag(tag);
        todoRepository.save(todo); // 태그 저장

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
        try {
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
        } catch (Exception e){
            System.err.println("값이 없습닏다 " + e.getMessage());
            return 0;
        }
    }

    public void updateTodoTags(Long userId, String statsDate) {
        String formattedDate = statsDate + "%";
        List<Todo> todos = todoRepository.findByUserIdAndTodoDateLikeAndTodoTagIsNull(userId, formattedDate);

        // todos 리스트가 비어 있지 않은 경우에만 처리
        if (todos != null && !todos.isEmpty()) {
            todos.forEach(todo -> {
                String tag = null; // 서비스 호출
                try {
                    tag = gptTagService.askGpt(todo.getTodoTitle(), userId);
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
        Map<String, Object> result = new LinkedHashMap<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm"); // 문자열 날짜 포맷 정의
        try {
            List<Todo> allTodos = todoRepository.findAllTodosByMonthAndUserId(userId, statsDate);
            int totalTodos = allTodos.size();

            List<String> todoTags = todoRepository.findAllTodoTagsByUserIdAndStatsDate(userId, statsDate);

            if (allTodos.isEmpty() || todoTags.isEmpty()) { // 예외처리!!!!!!!!!!!
                // 빈 리스트 검사 결과 하나라도 비어있을 경우 오류 응답 반환
                for (int i = 1; i <= 4; i++) {
                    result.put("Word" + i + "st", "");
                    result.put("Word" + i + "stNum", 0);
                    result.put("Word" + i + "stDoneTodos", 0);
                    result.put("Word" + i + "stPercent", 0);
                    result.put("Word" + i + "stTime", 0);
                }
                result.put("etcPercent", 0);
                result.put("etcNum", 0);
                result.put("etcTime", 0);
                result.put("statsDate", statsDate);

                return result;
            }

            Map<String, Long> wordFrequency = new HashMap<>();

            todoTags.forEach(tags -> Arrays.stream(tags.split(","))
                    .map(String::trim)
                    .filter(word -> !word.equalsIgnoreCase("없음"))
                    .forEach(word -> wordFrequency.put(word, wordFrequency.getOrDefault(word, 0L) + 1)));

            List<Map.Entry<String, Long>> sortedEntries = wordFrequency.entrySet().stream()
                    .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                    .limit(4)
                    .collect(Collectors.toList());

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

            int rank = 1;
            long etc = 0, etcNum = 0, etcTime = 0;
            for (Map.Entry<String, Long> entry : sortedEntries) {
                List<Todo> todosDone = todoRepository.findAllByUserIdAndStatsDateAndTodoTagAndTodoDone(userId, statsDate, entry.getKey(), true);
                List<Todo> todosWithTag = todoRepository.findAllByUserIdAndStatsDateAndTodoTag(userId, statsDate, entry.getKey());

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
                result.put("Word" + rank + "st", entry.getKey());
                result.put("Word" + rank + "stNum", entry.getValue());
                result.put("Word" + rank + "stDoneTodos", todosDone.size());
                result.put("Word" + rank + "stPercent", frequencyPercentage);
                result.put("Word" + rank + "stTime", totalDurationMinutes);
                etc += frequencyPercentage;
                etcNum += entry.getValue();
                etcTime += totalDurationMinutes;
                rank++;
            }
            // 충분한 단어가 없는 경우 빈 값으로 채우기
            while (rank <= 4) {
                result.put("Word" + rank + "st", "");
                result.put("Word" + rank + "stNum", 0);
                result.put("Word" + rank + "stDoneTodos", 0);
                result.put("Word" + rank + "stPercent", 0);
                result.put("Word" + rank + "stTime", 0);
                rank++;
            }

            result.put("etcPercent", 100 - etc);
            result.put("etcNum", totalTodos - etcNum);
            result.put("etcTime", totalDurationAllTodos - etcTime);
            result.put("statsDate", statsDate);

            System.out.println("totalTodos는 : " + (result.containsKey("etcNum") ? result.get("etcNum") : 0));

            return result;

        } catch (Exception e) {
            e.printStackTrace();

            Map<String, Object> ErrResponse = new HashMap<>();

            for (int i = 1; i <= 4; i++) {
                ErrResponse.put("Word" + i + "st", "");
                ErrResponse.put("Word" + i + "stNum", 0);
                ErrResponse.put("Word" + i + "stDoneTodos", 0);
                ErrResponse.put("Word" + i + "stPercent", 0);
                ErrResponse.put("Word" + i + "stTime", 0);
            }
            ErrResponse.put("etcPercent", 0);
            ErrResponse.put("etcNum", 0);
            ErrResponse.put("etcTime", 0);
            ErrResponse.put("statsDate", statsDate);

            return ErrResponse;

        }
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
        try {
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

        } catch (DateTimeParseException e) {
            System.err.println("날짜 형식 오류: " + e.getMessage());

            Map<String, Long> errorResult = new HashMap<>();
            String[] days = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"};
            for (String day : days) {
                errorResult.put(day + "doneTodos", 0L);
                errorResult.put(day + "totalTodos", 0L);
            }
            return errorResult;

        } catch (DataAccessException e) {
            System.err.println("데이터베이스 접근 오류: " + e.getMessage());

            Map<String, Long> errorResult = new HashMap<>();
            String[] days = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"};
            for (String day : days) {
                errorResult.put(day + "doneTodos", 0L);
                errorResult.put(day + "totalTodos", 0L);
            }
            return errorResult;
        } catch (Exception e) {
            System.err.println("알 수 없는 오류 발생: " + e.getMessage());

            Map<String, Long> errorResult = new HashMap<>();
            String[] days = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"};
            for (String day : days) {
                errorResult.put(day + "doneTodos", 0L);
                errorResult.put(day + "totalTodos", 0L);
            }
            return errorResult;
        }
    }

    public Map<String, Object> getGoal(Long userId, String statsDate) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 목표가 존재하는지 확인하는 로직
            List<Goal> goalExist = goalRepository.findByUserIdAndStatsDate(userId, statsDate);

            //저번달 변환 로직
            DateTimeFormatter parseFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd"); // 날짜 파싱을 위한 포맷터
            DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy.MM"); // 날짜 출력을 위한 포맷터
            LocalDate date = LocalDate.parse(statsDate + ".01", parseFormatter); // statsDate에서 LocalDate 객체를 생성
            LocalDate prevMonthDate = date.minusMonths(1); // 이전 달의 LocalDate 객체를 계산
            String prevMonthStatsDate = prevMonthDate.format(outputFormatter); // 이전 달을 "YYYY.MM" 형식으로 변환

            //prompt 가공 로직
            Map<String, Object> wordsResult = findWords(userId, prevMonthStatsDate); // 최빈도 단어들 추출
            String wordsResultText = formatWordsResult(wordsResult); //텍스트 화
            String goalResult = gptGoalService.askGpt(wordsResultText); // gpt 작동
            String cleanedGoalResult = removeNewLines(goalResult); // 줄바꿈 제거
            String cleanCleanResult = convertToJosonFormat(cleanedGoalResult); //json 형식 검사

            parseGoalResult(cleanCleanResult, response); // json 내용들 추출

            if (!goalExist.isEmpty()) {
                // 해당하는 달의 목표가 존재하는 경우
                System.out.println("있음");

                // 기존 목표 정보를 response에 추가
                for (Goal goal : goalExist) {
                    response.put("goalTitle", goal.getGoalTitle());
                    response.put("goalTime", goal.getGoalTime());
                    response.put("goalAchieveRate", goal.getGoalAchieveRate());
                }
            }
            return response;
        } catch (Exception e) {
            System.err.println("저번달 데이터가 없거나, gpt 오류가 났어요 " + e.getMessage());

            Map<String, Object> ErrResponse = new HashMap<>();
            ErrResponse.put("suggestGoalAchieveRate1", 0);
            ErrResponse.put("suggestGoalTime1", 0);
            ErrResponse.put("suggestGoalAchieveRate2", 0);
            ErrResponse.put("suggestGoalTitle3", "");  // 문자열 값은 유지
            ErrResponse.put("suggestGoalAchieveRate3", 0);
            ErrResponse.put("suggestGoalTitle2", "");  // 문자열 값은 유지
            ErrResponse.put("suggestGoalTime3", 0);
            ErrResponse.put("suggestGoalTitle1", "");  // 문자열 값은 유지
            ErrResponse.put("suggestGoalTime2", 0);

            return ErrResponse;
        }
    }


    private String convertToJosonFormat(String cleanedGoalResult) {
        // 각 배열 항목을 쉼표로 구분하여 분리
        String[] parts = cleanedGoalResult.split("],");

        // 각 부분의 끝에 "]"가 없으면 추가 (마지막 항목 제외)
        for (int i = 0; i < parts.length; i++) {
            if (!parts[i].trim().endsWith("]")) {
                parts[i] = parts[i].trim() + "]";
            }
        }

        // 각 항목을 쌍따옴표로 감싸서 JSON 문자열 배열로 만들기
        String result = "[";
        for (String part : parts) {
            // 숫자 배열은 그대로 두고, 문자 배열에 대해 쌍따옴표 추가
            if (part.matches("\\[\\d+(, \\d+)*\\]")) { // 숫자 배열 검사
                result += part + ",";
            } else {
                // 문자 배열이면 각 요소에 쌍따옴표 추가
                String[] items = part.replaceAll("[\\[\\]]", "").split(", ");
                result += "[\"" + String.join("\", \"", items) + "\"],";
            }
        }
        result = result.replaceAll(",+$", ""); // 마지막 쉼표 제거
        result += "]";

        return result;
    }

    // 현재 목표 달성 상태 체크하는 로직
    public Map<String, Object> currentGoal(Long userId, String statsDate) {
        List<Goal> goalExist = goalRepository.findByUserIdAndStatsDate(userId, statsDate);
        Map<String, Object> result = new HashMap<>();
        if (!goalExist.isEmpty()) {
            // 첫번째 goal_title 가져오기
            String goalTitle = goalExist.get(0).getGoalTitle();

            List<Todo> allTag = todoRepository.findAllByUserIdAndStatsDateAndTodoTag(userId, statsDate, goalTitle);

            // 문자열 날짜 포맷 정의
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            // 시간 계산 로직
            long totalDurationMinutes = allTag.stream()
                    .filter(todo -> todo.getTodoEndTime() != null && todo.getTodoStartTime() != null)
                    .filter(todo -> isValidTimeFormat(todo.getTodoStartTime(), timeFormatter) && isValidTimeFormat(todo.getTodoEndTime(), timeFormatter))
                    .mapToLong(todo -> {
                        LocalTime startTime = LocalTime.parse(todo.getTodoStartTime(), timeFormatter);
                        LocalTime endTime = LocalTime.parse(todo.getTodoEndTime(), timeFormatter);
                        Duration duration = Duration.between(startTime, endTime);
                        return duration.isNegative() ? duration.plusDays(1).toMinutes() : duration.toMinutes();
                    })
                    .sum();

            System.out.println("총시간은 : " + totalDurationMinutes);

            Long goalTime = goalExist.get(0).getGoalTime();

            double completionRate = 0;
            // 퍼센트 계산 로직
            if (goalTime > 0) { // 분모가 0이 되는 경우를 방지
                completionRate = ( (double) totalDurationMinutes / goalTime) * 100;
                completionRate = Math.min(completionRate, 100);
            }

            long completionRateLong = (long) completionRate;

            result.put("currentGoalRate", completionRateLong);

        } else {
            System.out.println("목표가 없어용");
        }
        return result;
    }


    //nlp 추출 로직
    private void parseGoalResult(String goalResult, Map<String, Object> response) {
        try {
            JSONArray mainArray = new JSONArray(goalResult);
            if (mainArray.length() != 3) {
                response.put("error", "Invalid JSON format: Expected three arrays.");
                return;
            }

            JSONArray titles = mainArray.getJSONArray(0);
            JSONArray rates = mainArray.getJSONArray(1);
            JSONArray times = mainArray.getJSONArray(2);

            for (int i = 0; i < titles.length(); i++) {
                response.put("suggestGoalTitle" + (i + 1), titles.getString(i));
                response.put("suggestGoalAchieveRate" + (i + 1), rates.getInt(i));
                response.put("suggestGoalTime" + (i + 1), times.getInt(i));
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

    @Transactional
    public void deleteGoal(Long userId, String goalDate) {
        // 일치하는 데이터가 있는지 확인
        if (goalRepository.existsByUserIdAndGoalDate(userId, goalDate)) {
            // 존재하면 삭제 수행
            goalRepository.deleteByUserIdAndGoalDate(userId, goalDate);
            System.out.println("삭제해드렸습니다");
        } else {
            // 해당 데이터가 없으면 콘솔에 메시지 출력
            System.out.println("목표가 없으세요");
        }
    }

    public Map<String, Object> findSummary(Long userId, String statsDate) throws Exception {
        Map<String, Object> result = new LinkedHashMap<>();

        // 입력한 달에 todo가 존재하는지 점검
        List<Todo> allTodos = todoRepository.findAllTodosByMonthAndUserId(userId, statsDate);

        if (allTodos.isEmpty()) {
            result.put("summaryResult", "이번달 데이터가 존재하지 않습니다.");

        } else {
            // summary가 db에 존재하는지 확인
            try {
                List<Summary> summaryExist = summaryRepository.findByUserIdAndSummaryStatsDate(userId, statsDate);
                if (summaryExist.isEmpty()) { // summary 데이터가 없는 경우에 대한 처리

                    Map<String, Object> wordsResult = findWords(userId, statsDate); // 최빈도 단어들 추출
                    String wordsResultText = formatWordsResult(wordsResult);

                    String goalResult = gptSummaryService.askGpt(wordsResultText);
                    result.put("summaryResult", goalResult);

                    boolean isCurrent = isCurrentMonth(statsDate);
                    System.out.println("입력한 날짜가 이번 달인가요? " + isCurrent);

                    if(!isCurrent){
                        //DB에 저장 로직
                        Summary newSummary = new Summary();
                        newSummary.setUserId(userId);
                        newSummary.setSummaryResult(goalResult);
                        newSummary.setSummaryStatsDate(statsDate);
                        summaryRepository.save(newSummary); // Summary 객체를 DB에 저장
                    }
                } else {  // summary 데이터가 있는 경우에 대한 처리
                    for (Summary summary : summaryExist) { // summaryResult만 추출
                        String summaryResult = summary.getSummaryResult();
                        result.put("summaryResult", summaryResult);
                    }
                }
            } catch (EmptyResultDataAccessException e){
                // summary가 존재하지 않습니다.


            }
        }
        return result;
    }

    // 오늘날짜와 같은 달인지 판별하는 코드
    public boolean isCurrentMonth(String statsDate) {
        // 입력된 statsDate가 올바른 형식인지 먼저 확인
        if (!statsDate.matches("\\d{4}\\.\\d{2}")) {
            System.err.println("날짜 형식이 올바르지 않습니다. 올바른 형식: YYYY.MM");
            return false;
        }

        // 현재 날짜 가져오기
        LocalDate currentDate = LocalDate.now();

        // 입력된 statsDate를 LocalDate로 변환
        LocalDate inputDate;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            inputDate = LocalDate.parse(statsDate + ".01", formatter); // 월의 첫 날을 사용하여 날짜로 파싱
        } catch (DateTimeParseException e) {
            System.err.println("날짜 파싱 중 오류가 발생했습니다: " + statsDate + ". 확인해 주세요.");
            return false;
        }

        // 현재 월과 입력된 월이 동일한지 확인
        return currentDate.getMonth() == inputDate.getMonth() && currentDate.getYear() == inputDate.getYear();
    }

}
