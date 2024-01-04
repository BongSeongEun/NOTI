package hello.hellospring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Arrays;

@RestController
public class welcomeController {
    @GetMapping("/api/v1/welcome")
    public List<String> Hello() {
        return Arrays.asList("리액트 스프링", "연결 성공");
    }
}