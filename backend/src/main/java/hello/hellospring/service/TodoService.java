package hello.hellospring.service;

import hello.hellospring.Exception.AppException;
import hello.hellospring.dto.TodoDTO;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.AI.GptTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public int countCompletedTodosByMonthAndUserId(Long userId, String month) {
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
                    System.err.println("이 문구가 뜨면.. 좀만 이따가 다시 실행해주세요..: " + todo.getTodoId() + " - " + e.getMessage());
                }
                todo.setTodoTag(tag);
                todoRepository.save(todo); // 태그 저장
            });
        } else {
            // todos 리스트가 비어 있는 경우
            System.out.println("No todos found for userId: " + userId + " and statsDate: " + statsDate);
        }
    }

    public Map<String, Object> findTopFourFrequentWordsInTodoTags() {
        List<String> todoTags = todoRepository.findAllTodoTags();
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
        for (Map.Entry<String, Long> entry : sortedEntries) {
            result.put(rank + "번째", entry.getKey());
            result.put(rank + "번째빈도수", entry.getValue());
            rank++;
        }

        return result;
    }



}
