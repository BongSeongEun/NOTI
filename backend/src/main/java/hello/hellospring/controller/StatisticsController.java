package hello.hellospring.controller;

import hello.hellospring.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatisticsController {

    private final TodoRepository todoRepository;


    @Autowired
    public StatisticsController(TodoRepository todoRepository) {

        this.todoRepository = todoRepository;


    }
}
