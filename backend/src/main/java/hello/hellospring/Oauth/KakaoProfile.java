package hello.hellospring.Oauth;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class KakaoProfile {

    public Long id;
    public String connected_at;
    public KakaoAccount kakao_account;
    public String synched_at;

    @Data
    public class KakaoAccount {
        public Boolean has_email;
        public Boolean email_needs_agreement;
        public Boolean is_email_valid;
        public Boolean is_email_verified;
        public String email;

    }

}