package hello.hellospring.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import hello.hellospring.Oauth.OauthToken;
import hello.hellospring.jwt.JwtProperties;
import hello.hellospring.model.Kakao;
import hello.hellospring.model.User;
import hello.hellospring.service.KakaoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class KakaoController {

    @Autowired
    private KakaoService kakaoService;

    // 프론트에서 인가코드 받아오는 url
    @PostMapping("/auth")
    public ResponseEntity getLogin(@RequestParam String code, HttpServletRequest response) throws JsonProcessingException {

        // 넘어온 인가 코드를 통해 access_token 발급
        OauthToken oauthToken = kakaoService.getAccessToken(code);
        // 발급 받은 accessToken 으로 카카오 회원 정보 DB 저장
        String jwtToken = kakaoService.SaveUserAndGetToken(oauthToken.getAccess_token());
        HttpHeaders headers = new HttpHeaders();
        headers.add(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + jwtToken);
        return ResponseEntity.ok().headers(headers).body("success");
    }
    // jwt 토큰으로 유저정보 요청하기
    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(HttpServletRequest request) {
        Kakao kakao = kakaoService.getUser(request);
        return ResponseEntity.ok().body(kakao);
    }

}
