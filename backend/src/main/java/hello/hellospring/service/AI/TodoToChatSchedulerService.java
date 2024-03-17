package hello.hellospring.service.AI;


import hello.hellospring.model.Chat;
import hello.hellospring.model.Todo;
import hello.hellospring.repository.ChatRepository;
import hello.hellospring.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ScheduledFuture;

@Service
public class TodoToChatSchedulerService { // todoEndTime에 해당하는 시간이 되면 자동으로 gpt가 물어보게 하기
    private final TaskScheduler taskScheduler;
    private final TodoRepository todoRepository;
    private final ChatRepository chatRepository;
    private ScheduledFuture<?> scheduledFuture;

    @Autowired
    public TodoToChatSchedulerService(TaskScheduler taskScheduler, TodoRepository todoRepository, ChatRepository chatRepository) {
        this.taskScheduler = taskScheduler;
        this.todoRepository = todoRepository;
        this.chatRepository = chatRepository;
        scheduleTask();
    }
    private void checkTodosAndCreateChat() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        List<Todo> todos =
                todoRepository.findByTodoDateAndTodoEndTimeAndTodoDoneIsFalse(
                        today.format(DateTimeFormatter.ofPattern("yyyy.MM.dd")),
                        now.format(DateTimeFormatter.ofPattern("HH:mm")));

        todos.forEach(todo -> {
            if (todo.isTodoDone()) {
                return;
            }

            Chat chat = new Chat();
            chat.setUserId(todo.getUserId());
            chat.setChatContent(todo.getTodoTitle() + "를 달성하셨나요?");
            chat.setChatWho(true);
            chat.setTodoFinishAsk(true);
            chat.setTodoFinishAns(false);
            chatRepository.save(chat);
        });
    }

    private void scheduleTask() {
        String cronExpression = "0 * * * * ?"; // 매 분마다 작업 실행
        scheduledFuture = taskScheduler.schedule(this::checkTodosAndCreateChat, new CronTrigger(cronExpression));
    }
}
