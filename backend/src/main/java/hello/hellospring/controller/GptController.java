package hello.hellospring.controller;


import hello.hellospring.service.GptService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class GptController {
    private final GptService gptService;

    @Autowired
    public GptController(GptService gptService){
        this.gptService = gptService;
    }

    @PostMapping("/ask")
    public String ask(@RequestBody String prompt) throws JSONException {
        return gptService.ask(prompt);
    }

}
