package hello.hellospring.controller;

import hello.hellospring.dto.DiaryDTO;
import hello.hellospring.model.Diary;
import hello.hellospring.service.AI.TodoToChatSchedulerService;
import hello.hellospring.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.connector.Response;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// DTO에서 담아서 Controller로 넘어오도록
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/") //모든 diaryController 적용

public class DiaryController {
    private final DiaryService diaryService; // 생성자 주입방식으로 의존성 주입
    private final TodoToChatSchedulerService todoToChatSchedulerService;

    @GetMapping("/diarylist/{userId}") // 리스트 조회
    public ResponseEntity<List<DiaryDTO>> getDiary(@PathVariable Long userId){ //Model model 뺌
        // DB에서 전체 게시글 데이터를 가져와서 보여준다
        List<DiaryDTO> diaryDTOList = diaryService.findByUserId(userId); //dto가 담겨있는 여러개의 리스트
        return new ResponseEntity<>(diaryDTOList, HttpStatus.OK);
    }

    @GetMapping("/diaryDetail/{userId}/{diaryId}") // 특정 사용자의 특정 다이어리 항목 조회
    public ResponseEntity<DiaryDTO> getDiaryDetail(@PathVariable Long userId, @PathVariable Long diaryId) {
        // 서비스 계층을 통해 특정 사용자의 특정 다이어리 항목 조회
        DiaryDTO diaryDTO = diaryService.findByUserIdAndDiaryId(userId, diaryId);
        return ResponseEntity.ok(diaryDTO);
    }

    @GetMapping("/diaryDate/{userId}/{diaryDate}")
    public ResponseEntity<DiaryDTO> getDiaryByDate(@PathVariable Long userId, @PathVariable String diaryDate) {
        // 서비스 계층을 통해 특정 사용자의 특정 날짜에 해당하는 다이어리 항목 조회
        DiaryDTO diaryDTO = diaryService.findByUserIdAndDiaryDate(userId, diaryDate);
        return ResponseEntity.ok(diaryDTO);
    }


    @DeleteMapping("/diaryDelete/{userId}/{diaryId}") //삭제
    public ResponseEntity<?> deleteDiary(@PathVariable Long userId, @PathVariable Long diaryId) {
        diaryService.delete(userId, diaryId); // 서비스 계층에서 일기 삭제 처리
        return ResponseEntity.ok().build();
    }
    @PutMapping("/diaryUpdate/{userId}/{diaryId}")
    public ResponseEntity<DiaryDTO> updateDiary(@PathVariable Long userId, @PathVariable Long diaryId, @RequestBody DiaryDTO diaryDTO) {
        // 클라이언트로부터 전달받은 diaryDTO를 이용하여 서비스 계층에서 일기 업데이트 처리
        DiaryDTO updatedDiary = diaryService.update(userId, diaryId, diaryDTO);
        return ResponseEntity.ok(updatedDiary);
    }

    @GetMapping("/diaryEmotion/{userId}/{emotionDate}") // 한달동안의 일기 감정추출
    public ResponseEntity<?> getEmotion(@PathVariable Long userId, @PathVariable String emotionDate){
        Map<String, Object> emotionList = diaryService.findEmotion(userId, emotionDate);
        return ResponseEntity.ok(emotionList);

    }
    
    @GetMapping("/calendarapi")
    public ResponseEntity<?> getcalendarAccessToken(){
        String accessToken = todoToChatSchedulerService.getGoogleAccessToken();
        return ResponseEntity.ok(accessToken);
    }


// ______________________________________________________________ 폐기합니다 ._.

    @PostMapping("/diaryUpdate") // 안쓸거임
    public String update(@ModelAttribute DiaryDTO diaryDTO, Model model){
        List<DiaryDTO> diaryDTO1 = diaryService.update(diaryDTO); // 메소드 호출
        model.addAttribute("diaryDTO1", diaryDTO1);
        return null;
    }

    @GetMapping("/diaryPaging/{userId}") //페이징처리 아 해야되는데 언제하지ㅋㅋ
    public ResponseEntity<Page<DiaryDTO>> getDiariesByUserId(
            @PathVariable Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Page<DiaryDTO> diaryPage = diaryService.getDiariesByUserId(userId, page, size);
        return ResponseEntity.ok(diaryPage);
    }
}







