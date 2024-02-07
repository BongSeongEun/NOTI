package hello.hellospring.controller;

import hello.hellospring.dto.DiaryDTO;
import hello.hellospring.model.Diary;
import hello.hellospring.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// DTO에서 담아서 Controller로 넘어오도록
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/") //모든 diaryController 적용

public class DiaryController {
    private final DiaryService diaryService; // 생성자 주입방식으로 의존성 주입

//    @PostMapping("/getDiary")
//    public ResponseEntity<?> getDiary(@PathVariable String userId, @RequestBody DiaryDTO diaryDTO){
//        Diary entity = DiaryDTO.toEntity
//    }

//    @PostMapping("/getDiary")
//    public String getDiary(@ModelAttribute DiaryDTO diaryDTO){
//        diaryService.save(diaryDTO);
//        return null;
//    }
    @GetMapping("/diarylist/{userId}")
    public ResponseEntity<List<DiaryDTO>> getDiary(Model model, @PathVariable String userId){
        // DB에서 전체 게시글 데이터를 가져와서 보여준다
        List<DiaryDTO> diaryDTOList = diaryService.findAll(); //dto가 담겨있는 여러개의 리스트
        //model.addAttribute("diaryList", diaryDTOList); //가져온걸 모델 객체에 담아감
        //return "diaryList";
        return new ResponseEntity<>(diaryDTOList, HttpStatus.OK);

    }



    @PostMapping("/getDiary/{userId}") //테스트 용으로 만듦
    public String postDiary(){
        return null;
    }



}
