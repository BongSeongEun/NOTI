package hello.hellospring.service;

import hello.hellospring.dto.DiaryDTO;
import hello.hellospring.model.Diary;
import hello.hellospring.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// 서비스는 dto -> entity   or   entity -> dto

@Service
//@AllArgsConstructor
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;

    public void save(DiaryDTO diaryDTO) {
        Diary diary = Diary.toSaveEntity(diaryDTO);
        diaryRepository.save(diary);
    }

    public List<DiaryDTO> findByUserId(Long userId) {
        List<Diary> diaryList = diaryRepository.findByUserId(userId); //리스트 형태의 entity넘어옴
        List<DiaryDTO> diaryDTOList = new ArrayList<>(); // 온 데이터를 diaryDTOList에 담기
        for (Diary diary: diaryList){
            diaryDTOList.add(DiaryDTO.diaryDTO(diary));
        }
        return diaryDTOList;

    }

    @Transactional
    public List<DiaryDTO> delete(Long userId, Long diaryId){
        diaryRepository.deleteByDiaryIdAndUserId(Long.valueOf(diaryId), Long.valueOf(userId));
        return findByUserId(userId);
}

    public List<DiaryDTO> update(DiaryDTO diaryDTO) {
        Diary diary = Diary.toUpdateEntity(diaryDTO);
        diaryRepository.save(diary);
        return findByUserId(diaryDTO.getUserId());
    }




    public DiaryDTO update(Long userId, Long diaryId, DiaryDTO diaryDTO) {
        // ID를 이용하여 기존 Diary 조회
        Diary diary = (Diary) diaryRepository
                .findByUserIdAndDiaryId(userId, diaryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "diary_id를 찾을수 없어요...ㅠㅠ: " + diaryId));

        // Diary 정보 업데이트
        diary.setDiaryTitle(diaryDTO.getDiaryTitle());
        diary.setDiaryContent(diaryDTO.getDiaryContent());
        diary.setDiaryImg(diaryDTO.getDiaryImg());

        // 업데이트된 Diary 저장
        diaryRepository.save(diary);

        // 업데이트된 Diary 정보를 DiaryDTO로 변환하여 반환
        return DiaryDTO.diaryDTO(diary);
    }


    public DiaryDTO findByUserIdAndDiaryId(Long userId, Long diaryId) {
        Diary diary = (Diary) diaryRepository.findByUserIdAndDiaryId(userId, diaryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user_id를 찾을 수 없어요..." + userId + " 앗.. diray_id도요... :( " + diaryId));
        // 조회된 Diary 엔티티를 DiaryDTO로 변환하여 반환
        return DiaryDTO.diaryDTO(diary);
    }

    public DiaryDTO findByUserIdAndDiaryDate(Long userId, String diaryDate) {
        List<Diary> diaries = diaryRepository.findByUserIdAndDiaryDate(userId, diaryDate);
        if (diaries.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "일치하는 일기를 찾을 수 없어요...");
        }
        // 첫 번째 일기 엔티티를 DiaryDTO로 변환하여 반환
        return DiaryDTO.diaryDTO(diaries.get(0));
    }



    // 페이징
    public Page<DiaryDTO> getDiariesByUserId(Long userId, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        Page<Diary> diaryPage = (Page<Diary>) diaryRepository.findByUserId(userId, pageable);

        return diaryPage.map(this::convertToDiaryDTO);
    }
    // Diary 엔티티를 DiaryDTO로 변환
    private DiaryDTO convertToDiaryDTO(Diary diary) {
        // Diary 엔티티를 DiaryDTO로 변환하는 로직 구현
        return new DiaryDTO();
    }

    // 일기 한달 단위로 감정표현 출력
    public Map<String, Object> findEmotion(Long userId, String emotionDate) {
        List<Diary> diaryEmotions = diaryRepository.findByUserIdAndEmotionDate(userId, emotionDate);
        Map<String, Object> result = new HashMap<>();
        if(!diaryEmotions.isEmpty()){    // 일기 데이터가 있는 경우
            for (Diary diary : diaryEmotions) {
                String diaryDate = diary.getDiaryDate(); // 날짜 추출, 예를 들면 "2024-05-01"
                Long emotion = diary.getDiaryEmotion(); // 감정 값 추출, 이는 long 유형임

                // 날짜별 감정 값을 저장하는 Map 구조를 갱신
                result.put(diaryDate, emotion);
                System.out.println(emotion);
            }

        } else {    //일기 데이터가 없는경우
            System.out.println(" ");
        }
        return result;
    }
}
