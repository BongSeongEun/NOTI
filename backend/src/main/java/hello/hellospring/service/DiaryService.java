package hello.hellospring.service;

import hello.hellospring.dto.DiaryDTO;
import hello.hellospring.model.Diary;
import hello.hellospring.repository.DiaryRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
}
