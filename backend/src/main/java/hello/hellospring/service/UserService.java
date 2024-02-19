package hello.hellospring.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import hello.hellospring.Oauth.KakaoProfile;
import hello.hellospring.Oauth.OauthToken;
import hello.hellospring.dto.UserDTO;
import hello.hellospring.jwt.JwtProperties;
import hello.hellospring.model.User;
import hello.hellospring.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Date;

@Service
@AllArgsConstructor
public class UserService {

    @Autowired
    UserRepository userRepository;

    public void updateUser(Long userId, UserDTO userDTO) {
        User user = userRepository.findByUserId(userId);
        user.updateUserInfo(userDTO.getUserNickname(), userDTO.getUserProfile(), userDTO.getUserColor(), userDTO.getMuteStartTime(), userDTO.getMuteEndTime(), userDTO.getDiaryTime());
        userRepository.save(user);
    }
    public OauthToken getAccessToken(String code) {

        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "77cf97c36317f2622a926b9ddb30f96f");
        params.add("redirect_uri", "http://localhost:3000/auth");
        params.add("code", code);


        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);

        ResponseEntity<String> accessTokenResponse = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(accessTokenResponse.getBody(), OauthToken.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return oauthToken;
    }
    public OauthToken getAccessTokenNative(String code) {

        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "77cf97c36317f2622a926b9ddb30f96f");
        params.add("redirect_uri", "http://172.20.10.5:4000/authnative");
        params.add("code", code);


        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);

        ResponseEntity<String> accessTokenResponse = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(accessTokenResponse.getBody(), OauthToken.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return oauthToken;
    }
    public KakaoProfile findProfile(String token) {

        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token); //(1-4)
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest =
                new HttpEntity<>(headers);

        // Http 요청 (POST 방식) 후, response 변수에 응답을 받음
        ResponseEntity<String> kakaoProfileResponse = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoProfileRequest,
                String.class
        );

        ObjectMapper objectMapper = new ObjectMapper();
        KakaoProfile kakaoProfile = null;
        try {
            kakaoProfile = objectMapper.readValue(kakaoProfileResponse.getBody(), KakaoProfile.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return kakaoProfile;
    }
    public String SaveUserAndGetToken(String token) {
        KakaoProfile profile = findProfile(token);

        // profile 객체가 null인지 확인
        if (profile == null || profile.getKakao_account() == null) {
            return "Error message or handling logic";
        }

        User user = userRepository.findByKakaoEmail(profile.getKakao_account().getEmail());
        if (user == null) {
            user = User.builder()
                    .kakaoId(profile.getId())
                    .kakaoEmail(profile.getKakao_account().getEmail())
                    .build();
            userRepository.save(user);
        }

        return createToken(user);
    }
    public String createToken(User user) {

        String jwtToken = JWT.create()
                .withSubject(user.getKakaoEmail())
                .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProperties.EXPIRATION_TIME))
                .withClaim("id", user.getUserId())
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        return jwtToken;
    }
    public User getUserInfo(Long userId){
        return userRepository.findByUserId(userId);
    }
}
