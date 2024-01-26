package hello.hellospring.controller;

import hello.hellospring.model.Kakao;
import hello.hellospring.model.User;
import hello.hellospring.repository.KakaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class UserController {
    private final KakaoRepository kakaoRepository;
    @PostMapping("/user/save")
    public void userSave(@RequestBody Kakao kakao) {
        kakaoRepository.save(kakao);
    }
}

