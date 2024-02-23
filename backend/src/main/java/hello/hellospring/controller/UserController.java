package hello.hellospring.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import hello.hellospring.Oauth.OauthToken;
import hello.hellospring.dto.UserDTO;
import hello.hellospring.jwt.JwtProperties;
import hello.hellospring.model.User;
import hello.hellospring.repository.UserRepository;
import hello.hellospring.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@AllArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    // 프론트에서 인가코드 받아오는 url
    @RequestMapping(value = "/auth", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity getLogin(@RequestParam String code, HttpServletRequest response) throws JsonProcessingException {

        // 넘어온 인가 코드를 통해 access_token 발급
        OauthToken oauthToken = userService.getAccessToken(code);
        // 발급 받은 accessToken 으로 카카오 회원 정보 DB 저장
        String jwtToken = userService.SaveUserAndGetToken(oauthToken.getAccess_token());
        HttpHeaders headers = new HttpHeaders();
        headers.add(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + jwtToken);
        return ResponseEntity.ok().headers(headers).body("success");
    }

    @RequestMapping(value = "/authnative", method = {RequestMethod.GET, RequestMethod.POST})
    public RedirectView getLoginNative(@RequestParam String code) throws JsonProcessingException {
        // 넘어온 인가 코드를 통해 access_token 발급
        OauthToken oauthToken = userService.getAccessTokenNative(code);
        // 발급 받은 accessToken 으로 카카오 회원 정보 DB 저장
        String jwtToken = userService.SaveUserAndGetToken(oauthToken.getAccess_token());

        // 클라이언트에게 전달할 커스텀 URL 생성
        String redirectUrl = "http://192.168.240.252:4000/success&token=" + jwtToken;

        // 클라이언트를 리디렉트 URL로 리디렉션
        return new RedirectView(redirectUrl);
    }

    @RequestMapping(value = "/api/v1/user/{userId}", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody UserDTO userDTO) {
        try {
            userService.updateUser(Long.valueOf(userId), userDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/api/v1/userInfo/{userId}")
    public ResponseEntity getUserInfo(@PathVariable Long userId){
        User user = userService.getUserInfo(userId);
        return ResponseEntity.ok().body(user);
    }

}

