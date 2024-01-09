package hello.hellospring.controller;

import hello.hellospring.model.User;
import hello.hellospring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    @PostMapping("/user/save")
    public void userSave(@RequestBody User user) {
        userRepository.save(user);
    }
}

