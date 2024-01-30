package hello.hellospring.service;

import hello.hellospring.dto.UserDTO;
import hello.hellospring.model.User;
import hello.hellospring.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;

    public Long saveUser(UserDTO userDTO) {
        userRepository.save(userDTO.toEntity());
        return userDTO.getUserId();
    }
}
