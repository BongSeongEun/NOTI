package hello.hellospring.service;

public interface GptDiaryService {
    String askGpt(String userMessage) throws Exception;
    String createDiary(Long userId) throws Exception; // userId에 해당하는 chatContent들로 일기 생성
}
