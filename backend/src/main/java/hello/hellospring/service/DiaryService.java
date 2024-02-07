package hello.hellospring.service;

import hello.hellospring.dto.DiaryDTO;
import hello.hellospring.repository.DiaryRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// 서비스는 dto -> entity   or   entity -> dto

@Service
//@AllArgsConstructor
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;

    public void save(DiaryDTO diaryDTO) {
        DiaryRepository.save();
    }
}
