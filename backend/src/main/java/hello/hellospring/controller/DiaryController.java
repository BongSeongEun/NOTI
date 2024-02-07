package hello.hellospring.controller;

import hello.hellospring.dto.DiaryDTO;
import hello.hellospring.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

// DTO에서 담아서 Controller로 넘어오도록
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v2/") //모든 diaryController 적용

public class DiaryController {
    private final DiaryService diaryService; // 생성자 주입방식으로 의존성 주입

    @GetMapping("/getDiary/{userId}")
    public String getDiary(@ModelAttribute DiaryDTO diaryDTO){
        diaryService.save(diaryDTO);


        return null;
    }

    @PostMapping("/getDiary/{userId}") //테스트 용으로 만듦
    public String postDiary(){
        return null;
    }



}
