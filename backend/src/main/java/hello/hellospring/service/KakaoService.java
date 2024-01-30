package hello.hellospring.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import hello.hellospring.Oauth.KakaoProfile;
import hello.hellospring.Oauth.OauthToken;
import hello.hellospring.jwt.JwtProperties;
import hello.hellospring.model.Kakao;
import hello.hellospring.repository.KakaoRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;

@Service
public class KakaoService {

    @Autowired
    KakaoRepository kakaoRepository; //(1)

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

        return oauthToken; //(8)
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
    public Kakao getUser(HttpServletRequest request) { //(1)
        //(2)
        Long userId = (Long) request.getAttribute("userId");

        //(3)
        Kakao kakao = kakaoRepository.findByUserId(userId);

        //(4)
        return kakao;
    }
    public String SaveUserAndGetToken(String token) {
        KakaoProfile profile = findProfile(token);

        // profile 객체가 null인지 확인
        if (profile == null || profile.getKakao_account() == null) {
            // 적절한 오류 처리 로직
            // 예: 오류 로그 기록, 사용자에게 오류 메시지 반환 등
            return "Error message or handling logic"; // 이 부분을 적절하게 수정
        }

        Kakao kakao = kakaoRepository.findByKakaoEmail(profile.getKakao_account().getEmail());
        if (kakao == null) {
            kakao = Kakao.builder()
                    .userId(profile.getId())
                    .kakaoProfileImg(profile.getKakao_account().getProfile().getProfile_image_url())
                    .kakaoNickname(profile.getKakao_account().getProfile().getNickname())
                    .kakaoEmail(profile.getKakao_account().getEmail())
                    .build();

            kakaoRepository.save(kakao);
        }

        return createToken(kakao);
    }


    public String createToken(Kakao kakao) { //(2-1)

        String jwtToken = JWT.create()
                .withSubject(kakao.getKakaoEmail())
                .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProperties.EXPIRATION_TIME))
                .withClaim("id", kakao.getUserId())
                .withClaim("nickname", kakao.getKakaoNickname())
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        return jwtToken; //(2-6)
    }

}