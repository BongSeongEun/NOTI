package hello.hellospring.controller;

import hello.hellospring.dto.UserDTO;
import hello.hellospring.repository.UserRepository;
import hello.hellospring.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @Autowired
    private final UserRepository userRepository;
    @PostMapping("/api/v1/user/save")
    public Long saveUser(@RequestBody UserDTO userDTO) {
        return userService.saveUser(userDTO);
    }
}

