package hello.hellospring.controller;

import hello.hellospring.service.GptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GptController {

    private final GptService gptService; //service 참조

    @Autowired
    public GptController(GptService gptService) {
        this.gptService = gptService;
    }

    @PostMapping("/ask")
    public String ask(@RequestBody String userMessage) {
        try {
            return gptService.askGpt(userMessage);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing your request.";
        }
    }

}
