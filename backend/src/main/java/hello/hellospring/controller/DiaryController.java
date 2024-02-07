package hello.hellospring.controller;

import hello.hellospring.dto.DiaryDTO;
import hello.hellospring.model.Diary;
import hello.hellospring.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
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
    public ResponseEntity<List<DiaryDTO>> getDiary(@PathVariable Long userId){ //Model model 뺌
        // DB에서 전체 게시글 데이터를 가져와서 보여준다
        List<DiaryDTO> diaryDTOList = diaryService.findByUserId(userId); //dto가 담겨있는 여러개의 리스트
        //model.addAttribute("diaryList", diaryDTOList); //가져온걸 모델 객체에 담아감
        //return "diaryList";
        return new ResponseEntity<>(diaryDTOList, HttpStatus.OK);

    }

    @GetMapping("/diaryUpdate/{userId}")
    public ResponseEntity<List<DiaryDTO>> updateForm(@PathVariable Long userId) {
        List<DiaryDTO> diaryDTOList = diaryService.findByUserId(userId);

        // 우선 주석처리

//        if (diaryDTOList == null || diaryDTOList.isEmpty()) {
//            // 데이터가 없는 경우, 비어 있는 목록과 함께 404 Not Found 응답 반환
//            return ResponseEntity.notFound().build();
//        }


        // 데이터가 있는 경우, 200 OK 응답과 함께 데이터 반환
        return ResponseEntity.ok(diaryDTOList);
    }

    @PostMapping("/diaryUpdate")
    public String update(@ModelAttribute DiaryDTO diaryDTO, Model model){
        List<DiaryDTO> diaryDTO1 = diaryService.update(diaryDTO); // 메소드 호출
        model.addAttribute("diaryDTO1", diaryDTO1);
        return null;
    }




}
