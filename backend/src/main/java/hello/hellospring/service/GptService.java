package hello.hellospring.service;

import hello.hellospring.api.OpenAIApi;
import org.json.JSONException;
import org.springframework.stereotype.Service;

@Service
public class GptService {
    private final OpenAIApi openAIApi;

    public GptService(){
        this.openAIApi = new OpenAIApi();
    }

    public String ask(String prompt) throws JSONException {
        return openAIApi.ask(prompt);
    }
}
