package hello.hellospring.service;

import hello.hellospring.Exception.AppException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.AI.GptTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static hello.hellospring.Exception.ErrorCode.NO_TITLE_ENTERED;

@Service
public class TodoService {

    private final GptTagService gptTagService;
    private final TodoRepository todoRepository;
    @Autowired
    public TodoService(GptTagService gptTagService, TodoRepository todoRepository) {
        this.gptTagService = gptTagService;
        this.todoRepository = todoRepository;
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
        for (Map.Entry<String, Long> entry : sortedEntries) {
            int frequencyPercentage = (int) Math.round(((double) entry.getValue() / totalTodos) * 100);
            result.put("Word"+rank+"st", entry.getKey());
            result.put("Word"+rank+"stNum", entry.getValue());
            result.put("Word"+rank+"stPercent", frequencyPercentage);
            etc += frequencyPercentage;
            etcNum += entry.getValue();
            rank++;
        }
        long etcResult = 100 - etc; // 그외 퍼센트 계산
        long etcNumResult = totalTodos - etcNum;
        result.put("etcPercent", etcResult);
        result.put("etcNum", etcNumResult);

        System.out.println("totalTodos는 : "+totalTodos);

        return result;
    }


    public Map<String, Object> findWeekDay(Long userId, String statsDate) {
        List<Todo> allTodos = todoRepository.findAllTodosByMonthAndUserId(userId, statsDate);
        List<Todo> doneTodos = todoRepository.findAllTodosByMonthAndUserIdAndTodoDone(userId, statsDate, true);




        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        LocalDate startOfMonth = LocalDate.parse(statsDate + ".01", DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        List<String> Mon = new ArrayList<>();
        List<String> Tue = new ArrayList<>();
        List<String> Wed = new ArrayList<>();
        List<String> Thu = new ArrayList<>();
        List<String> Fri = new ArrayList<>();
        List<String> Sat = new ArrayList<>();
        List<String> Sun = new ArrayList<>();

        for (LocalDate date = startOfMonth; !date.isAfter(endOfMonth); date = date.plusDays(1)) {
            switch (date.getDayOfWeek()) {
                case MONDAY:
                    Mon.add(date.format(formatter));
                    break;
                case TUESDAY:
                    Tue.add(date.format(formatter));
                    break;
                case WEDNESDAY:
                    Wed.add(date.format(formatter));
                    break;
                case THURSDAY:
                    Thu.add(date.format(formatter));
                    break;
                case FRIDAY:
                    Fri.add(date.format(formatter));
                    break;
                case SATURDAY:
                    Sat.add(date.format(formatter));
                    break;
                case SUNDAY:
                    Sun.add(date.format(formatter));
                    break;
            }
        }
        System.out.println("Mon: " + Mon);
        System.out.println("Tue: " + Tue);
        System.out.println("Wed: " + Wed);
        System.out.println("Thu: " + Thu);
        System.out.println("Fri: " + Fri);
        System.out.println("Sat: " + Sat);
        System.out.println("Sun: " + Sun);





        return null;
    }
}
