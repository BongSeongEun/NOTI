# AI챗봇을 활용한 일정관리 플래너 - 노티 NOTI

<img src="https://github.com/user-attachments/assets/5b4f05a6-8d63-4c24-ad13-5436ec55e931">

***
## 🙋🏻 AI 챗봇을 이용해 간편하게 일정을 정리하자!
```
💡 일정 관리는 현대 사회에서 성공적인 업무와 개인 생활을 유지하는 중요한 요소입니다.
하지만 많은 사람들이 바쁜 스케줄과 과도한 업무로 인해 체계적인 계획을 세우지 못하고 있습니다.

이를 해결하기 위해, ChatGPT 기반 AI 챗봇을 활용한 일정 관리 시스템을 개발하였습니다!
이 시스템은 사용자가 쉽게 일정을 등록하고 관리할 수 있도록 도와주며,
리마인드 알림과 일정 수행 여부 확인 기능을 제공합니다.
또한, 팀 협업 기능과 일정 데이터 분석을 통해 개인과 팀의 생산성을 향상시키는 것을 목표로 하고 있습니다.
```

***

## 📃 Project Info
> 한국공학대학교 컴퓨터공학부 종합설계 S3-8
> 
> 개발 기간: 2023.09 ~ 2024.06
>
> 배포 주소(Web): http://15.165.100.226:3000/

***

## 🛠️ Stacks
- Environment
  
  <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"/> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/gitkraken-179287?style=for-the-badge&logo=gitkraken&logoColor=white">

- Config
  
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"/>
 
- Development
  
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/React Native-61DAFB?style=for-the-badge&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=Spring&logoColor=white"/> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"> 
  
- Communication
  
  <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"> <img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white">
  
***

## ✨ 프로젝트 개발자
|<img src="https://github.com/user-attachments/assets/e360dc37-556b-48da-92b6-83e58bc250cd" width="200" height="200"/>|<img src="https://github.com/user-attachments/assets/2fb5a02d-f41d-4429-a737-bfee321e4ecc" width="200" height="200"/>|<img src="https://github.com/user-attachments/assets/abc4a0f3-fe17-401a-b342-ed4a1c03f40f" width="200" height="200"/>|<img src="https://github.com/user-attachments/assets/28d037a1-31ee-4061-9191-4d60573276fb" width="200" height="200"/>|
|:---:|:---:|:---:|:---:|
|팀장|팀원|팀원|팀원|
|봉성은|박현수|이지현|채서윤|
|Back-end|Back-end|Front-end, Web|Front-end, App|

***

## 📺 화면 구성
|일정 페이지&일정 생성|팀 협업 페이지|
|:---:|:---:|
|<img src="https://github.com/user-attachments/assets/75120990-82f2-47d2-9050-d759dc8ec902" width="120"> <img src="https://github.com/user-attachments/assets/212f5a4e-f5b0-4ec7-8476-21e41d636cba" width="120">|<img src="https://github.com/user-attachments/assets/0cc685dc-9ff9-4eb6-8c01-11b909a1ed95" width="120"> <img src="https://github.com/user-attachments/assets/a22f16f3-ede3-45ef-b4ae-845c565f0fa7" width="120">|

|데일리 회고록 페이지|통계 분석 페이지|
|:---:|:---:|
|<img src="https://github.com/user-attachments/assets/f0caffc3-3008-48c5-847a-3eeaf6cd1445" width="120"> <img src="https://github.com/user-attachments/assets/fd16480a-3102-4ddb-910f-dab26bf4ce47" width="120">|<img src="https://github.com/user-attachments/assets/9316161a-fbca-473c-bbb2-4e8c4c375417" width="120"> <img src="https://github.com/user-attachments/assets/4c8ceb33-e203-4002-b26c-e0396a57b656" width="120">|

***
## ⚙️ 주요 기능

### 로그인 및 회원가입 모듈
- 카카오계정을 이용해 토큰 발급
- 토큰은 이용한 로그인 및 회원가입
- 방해 금지 시간 및 일기 자동 생성 시간 설정
- 테마 선택 기능
### 일정 관리 모듈
- 개인 일정에 대한 생성, 수정, 삭제, 조회 기능
- 일정의 내용과 시작 시간 및 끝나는 시간을 지정 가능
- 완료한 일정에 대해 표시 가능
### 협업 팀 관리 모듈
- 팀 생성, 삭제 기능 제공
- 팀이 만들어짐과 동시에 발급되는 랜덤 키를 공유해 다른사람이 팀에 참여할 수 있는 기능
- 팀 공통 일정 생성, 수정, 삭제, 조회 및 D-DAY 기능
- 등록한 개인 일정 중 원하는 일정을 팀에 공유해 서로 일정이 없는 시간대를 볼 수 있는 기능
- 팀 공유 메모장 기능
### GPT 채팅 모듈
- GPT와의 자유로운 채팅 기능
- 사용자가 보낸 채팅을 NLP를 사용해 EVENT로 인식될 경우 채팅 내용을 EVENT와 TIME으로 나누어 이를 개인 일정에 시간과 함께 자동 등록
- 개인 일정이 끝날 시간이 되면 그 일정에 대한 완료 여부를 채팅으로 질문 및 답변에 따라 일정 완료 유무 수정
### GPT 일기 모듈
- 오늘의 GPT와의 채팅, 그리고 등록된 개인 일정들을 취합해 하루를 정리할 수 있는 일기 제공
- 생성된 일기에 대한 조회, 삭제, 수정 기능
- 일기 내에 사진 추가 가능(앱 기능)
- 일기를 NLP로 분석해 감정에 따라 1~5단계 사이의 감정 이모티콘 제공
### GPT 통계 모듈
- 해당 달과 그 전 달의 일정 달성율을 제공 및 비교
- 해당 달에 대해 최빈 단어를 1~4위까지 태그화 후 분석 및 태그 별 퍼센테이지 제공
- 한달 간 요일 별 개인 일정 달성율 제공
- 해당 달 목표 추천 기능 및 목표 생성, 수정 삭제 기능
- 해당 달 목표 달성율 점검 기능
- 해당 달 통계에 대한 GPT의 한줄 요약 기능
### 알림 모듈
- 개인 일정이 끝날 시간이 되면 오는 완료여부 질문을 파이어베이스(FCM) API를 통해 알림으로 제공해 완료 여부 선택 가능
- 앱을 켰을 경우 뜨는 상시 알림을 통해 GPT와의 대화 기능
- 대화를 통해 일정 추가 및 완료 여부 전달 가능

### 🛠️ NOTI 데이터베이스 설계  <br/>
 https://www.notion.so/NOTI-36a20d703f2f4923bd0794985359db06?pvs=4  <br/>  <br/>
### 📃 NOTI API 명세서  <br/>
 https://www.notion.so/API-aa77fa7808c84c1697af7fbbb469f81a?pvs=4  <br/>
