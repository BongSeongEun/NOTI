package hello.hellospring.controller;

import hello.hellospring.dto.*;
import hello.hellospring.model.*;
import hello.hellospring.repository.TeamTogetherRepository;
import hello.hellospring.repository.TodoRepository;
import hello.hellospring.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.ZoneId;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/v1/")
public class TeamController {

    @Autowired
    TeamService teamService;
    @Autowired
    TodoRepository todoRepository;
    @Autowired
    TeamTogetherRepository teamTogetherRepository;

    // 특정 사용자의 팀 목록 조회
    @GetMapping("/getTeam/{userId}")
    public ResponseEntity<?> getTeam(@PathVariable String userId){
        List<TeamTogether> teamTogetherEntity = teamService.getTeamList(userId);
        List<TeamTogetherDTO> dtos = makeTeamTogetherDtoListFromEntityList(teamTogetherEntity);
        return ResponseEntity.ok().body(dtos);
    }
    // 특정 팀에 속한 사용자 목록 조회
    @GetMapping("/getUserTeam/{teamId}")
    public ResponseEntity<?> getUserTeam(@PathVariable String teamId){
        List<TeamTogether> teamTogetherEntity = teamService.getUserList(teamId);
        List<TeamTogetherDTO> dtos = makeTeamTogetherDtoListFromEntityList(teamTogetherEntity);
        return ResponseEntity.ok().body(dtos);
    }
    // 팀에 사용자 추가
    @PostMapping("/enterTeam/{userId}/{teamId}")
    public ResponseEntity<?> enterTeam(@PathVariable String userId, @PathVariable String teamId, TeamTogetherDTO teamTogetherDTO){
        List<TeamTogether> existTeam = teamService.findAllTeamsByTeamId(teamId);
        TeamTogether entity = TeamTogetherDTO.toEntity(teamTogetherDTO);
        entity.setUserId(Long.valueOf(userId));
        entity.setTeamTitle(existTeam.get(0).getTeamTitle());
        List<TeamTogether> teamTogetherEntity = teamService.createTeam(entity);
        List<TeamTogetherDTO> dtos = makeTeamTogetherDtoListFromEntityList(teamTogetherEntity);
        return ResponseEntity.ok().build();
    }
    // 팀에서 사용자 제거
    @DeleteMapping("/leaveTeam/{teamId}/{userId}")
    public ResponseEntity<?> deleteUserFromTeam(@PathVariable String teamId, @PathVariable String userId){
        teamService.deleteUserFromTeam(teamId, userId);
        return ResponseEntity.ok().build();
    }
    // 팀 생성 및 메모 생성
    @PostMapping("/createTeam/{userId}")
    public ResponseEntity<?> createTeam(@PathVariable Long userId, TeamDTO teamDTO, @RequestBody TeamTogetherDTO teamTogetherDTO, TeamMemoDTO teamMemoDTO){

        Random random = new Random();

        Team entity = TeamDTO.toEntity(teamDTO);
        entity.setTeamRandNum(getAuthcode());
        List<Team> teamEntity = teamService.createTeamTitle(entity);
        List<TeamDTO> dtos = makeTeamDtoListFromEntityList(teamEntity);

        TeamMemo teamMemoEntity = TeamMemoDTO.toEntity(teamMemoDTO);
        teamMemoEntity.setTeamId(entity.getTeamRandNum());
        List<TeamMemo> memoEntity = teamService.createTeamMemo(teamMemoEntity);
        List<TeamMemoDTO> dtoss = makeTeamMemoDtoListFromEntityList(memoEntity);

        TeamTogether togetherEntity = TeamTogetherDTO.toEntity(teamTogetherDTO);
        togetherEntity.setUserId(userId);
        togetherEntity.setTeamId(entity.getTeamRandNum());
        List<TeamTogether> teamTogetherEntity = teamService.createTeam(togetherEntity);
        List<TeamTogetherDTO> dtosss = makeTeamTogetherDtoListFromEntityList(teamTogetherEntity);

        return ResponseEntity.ok().body(dtos);
    }

    @GetMapping("/getTeamInfo/{teamId}")
    public ResponseEntity<?> getTeamInfo(@PathVariable String teamId){
        List<TeamTogether> entity = teamTogetherRepository.findByTeamId(teamId);
        return ResponseEntity.ok().body(entity.get(0).getTeamTitle());
    }

    // 팀에 새로운 Todo를 추가
    @PostMapping("/createTeamTodo/{teamId}")
    public ResponseEntity<?> createTeamTodo(@PathVariable String teamId, @RequestBody TeamTodoDTO teamTodoDTO){
        TeamTodo entity = TeamTodoDTO.toEntity(teamTodoDTO);
        entity.setTeamId(teamId);
        if (entity.getTeamTodoDate() == null){
            LocalDate now = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            String formatedNow = now.format(formatter);
            entity.setTeamTodoDate(String.valueOf(formatedNow));
        }
        List<TeamTodo> teamTodoEntity = teamService.createTeamTodo(entity);
        List<TeamTodoDTO> dtos = makeTeamTodoDtoListFromEntityList(teamTodoEntity);
        return ResponseEntity.ok().build();
    }
    // 팀의 Todo를 삭제
    @DeleteMapping("/deleteTeamTodo/{teamId}/{teamTodoId}")
    public ResponseEntity<?> deleteTeamTodo(@PathVariable String teamId, @PathVariable String teamTodoId){
        teamService.deleteTeamTodo(teamId, teamTodoId);
        return ResponseEntity.ok().build();
    }
    // 팀의 Todo목록을 조회
    @GetMapping("/getTeamTodo/{teamId}")
    public ResponseEntity<?> getTeamTodo(@PathVariable String teamId){
        List<TeamTodo> todoEntity = teamService.getTeamTodo(teamId);
        List<TeamTodoDTO> dtos = makeTeamTodoDtoListFromEntityList(todoEntity);
        return ResponseEntity.ok().body(dtos);
    }
    // 팀의 Todo를 업데이트
    @PutMapping("/updateTeamTodo/{teamId}/{teamTodoId}")
    public ResponseEntity<?> updateTeamTodo(@PathVariable String teamId, @PathVariable Long teamTodoId, @RequestBody TeamTodoDTO teamTodoDTO){
        TeamTodo updatedTeamTodo = teamService.updateTeamTodo(teamTodoDTO, teamId, teamTodoId);
        TeamTodoDTO dto = TeamTodoDTO.from(updatedTeamTodo);
        return ResponseEntity.ok().body(dto);
    }
    //팀에 개인일정을 추가
    @PostMapping("/inputSchedule/{teamId}/{todoId}")
    public ResponseEntity<?> inputSchedule(@PathVariable String teamId, @PathVariable Long todoId, TeamScheduleDTO teamScheduleDTO){
        TeamSchedule entity = TeamScheduleDTO.toEntity(teamScheduleDTO);
        entity.setTeamId(teamId);
        entity.setTodoId(todoId);
        List<TeamSchedule> teamScheduleEntity = teamService.inputScheduleInTeam(entity);
        List<TeamScheduleDTO> dtos =makeTeamScheduleDtoListFromEntiyList(teamScheduleEntity);
        return ResponseEntity.ok().build();
    }
    //팀에 들어가있는 개인 일정을 조회
    @GetMapping("/getSchedule/{teamId}")
    public ResponseEntity<?> getScheduleFromTeam(@PathVariable String teamId){
        // 팀 ID에 해당하는 TeamSchedule 목록 조회
        List<TeamSchedule> entity = teamService.getSchedule(teamId);

        // TeamSchedule 정보와 Todo의 시작/종료 시간을 포함하는 DTO 목록 생성
        List<Map<String, Object>> scheduleWithTodoTimes = new ArrayList<>();

        for (TeamSchedule schedule : entity) {
            // TeamSchedule에 저장된 todoId로 Todo 객체 조회
            Todo todo = todoRepository.findById(schedule.getTodoId()).orElse(null);

            if (todo != null) {
                Map<String, Object> scheduleInfo = new HashMap<>();
                scheduleInfo.put("teamScheduleId", schedule.getTeamScheduleId());
                scheduleInfo.put("teamId", schedule.getTeamId());
                scheduleInfo.put("todoId", schedule.getTodoId());
                // Todo의 시작 시간과 종료 시간 추가
                scheduleInfo.put("todoStartTime", todo.getTodoStartTime());
                scheduleInfo.put("todoEndTime", todo.getTodoEndTime());
                scheduleInfo.put("todoDate", todo.getTodoDate());

                scheduleWithTodoTimes.add(scheduleInfo);
            }
        }

        // 생성된 Map 목록을 JSON 형태로 클라이언트에 반환
        return ResponseEntity.ok().body(scheduleWithTodoTimes);
    }
    //팀에 들어가있는 개인 일정을 삭제
    @DeleteMapping("/deleteSchedule/{teamId}/{todoId}")
    public ResponseEntity<?> deleteScheduleFromTeam(@PathVariable String teamId, @PathVariable Long todoId){
        teamService.deleteSchedule(teamId, todoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getTeamMemo/{teamId}")
    public ResponseEntity<?> getTeamMemo(@PathVariable String teamId){
        List<TeamMemo> entity = teamService.getTeamMemo(teamId);
        List<TeamMemoDTO> dtos = makeTeamMemoDtoListFromEntityList(entity);
        return ResponseEntity.ok().body(dtos);
    }

    @PutMapping("/updateTeamMemo/{teamId}/{teamMemoId}")
    public ResponseEntity<TeamMemoDTO> updateTeamMemo(@PathVariable String teamId, @PathVariable Long teamMemoId, @RequestBody TeamMemoDTO teamMemoDTO){
        TeamMemo updatedMemo = teamService.updateTeamMemo(teamMemoDTO, teamId, teamMemoId);
        TeamMemoDTO dto = TeamMemoDTO.from(updatedMemo);
        return ResponseEntity.ok().body(dto);
    }

    private List<TeamDTO> makeTeamDtoListFromEntityList(List<Team> teamEntities){
        List<TeamDTO> teamDTOList = new ArrayList<>();

        for(Team teamEntity : teamEntities){
            TeamDTO teamDTO = TeamDTO.builder()
                    .teamId(teamEntity.getTeamId())
                    .teamRandNum(teamEntity.getTeamRandNum())
                    .build();
            teamDTOList.add(teamDTO);
        }
        return teamDTOList;
    }
    private List<TeamTodoDTO> makeTeamTodoDtoListFromEntityList(List<TeamTodo> teamTodoEntities){
        List<TeamTodoDTO> teamTodoDTOList = new ArrayList<>();

        for(TeamTodo teamTodoEntity : teamTodoEntities){
            TeamTodoDTO teamTodoDTO = TeamTodoDTO.builder()
                    .teamTodoId(teamTodoEntity.getTeamTodoId())
                    .teamId(teamTodoEntity.getTeamId())
                    .teamTodoDone(teamTodoEntity.isTeamTodoDone())
                    .teamTodoTitle(teamTodoEntity.getTeamTodoTitle())
                    .teamTodoDate(teamTodoEntity.getTeamTodoDate())
                    .teamTodoColor((teamTodoEntity.getTeamTodoColor()))
                    .build();
            teamTodoDTOList.add(teamTodoDTO);
        }
        return teamTodoDTOList;
    }
    private List<TeamMemoDTO> makeTeamMemoDtoListFromEntityList(List<TeamMemo> teamMemoEntities){
        List<TeamMemoDTO> teamMemoDTOList = new ArrayList<>();

        for(TeamMemo teamMemoEntity : teamMemoEntities){
            TeamMemoDTO teamMemoDTO = TeamMemoDTO.builder()
                    .teamMemoId(teamMemoEntity.getTeamMemoId())
                    .memoContent(teamMemoEntity.getMemoContent())
                    .teamId(teamMemoEntity.getTeamId())
                    .build();
            teamMemoDTOList.add(teamMemoDTO);
        }
        return teamMemoDTOList;
    }
    private List<TeamScheduleDTO> makeTeamScheduleDtoListFromEntiyList(List<TeamSchedule> teamScheduleEntities){
        List<TeamScheduleDTO> teamScheduleDTOList = new ArrayList<>();

        for(TeamSchedule teamScheduleEntity : teamScheduleEntities){
            TeamScheduleDTO teamScheduleDTO = TeamScheduleDTO.builder()
                    .teamScheduleId(teamScheduleEntity.getTeamScheduleId())
                    .teamId(teamScheduleEntity.getTeamId())
                    .todoId(teamScheduleEntity.getTodoId())
                    .build();
            teamScheduleDTOList.add(teamScheduleDTO);
        }
        return teamScheduleDTOList;
    }
    private List<TeamTogetherDTO> makeTeamTogetherDtoListFromEntityList(List<TeamTogether> teamTogetherEntities){
        List<TeamTogetherDTO> teamTogetherDTOList = new ArrayList<>();

        for(TeamTogether teamTogetherEntity : teamTogetherEntities){
            TeamTogetherDTO teamTogetherDTO = TeamTogetherDTO.builder()
                    .teamTogetherId(teamTogetherEntity.getTeamTogetherId())
                    .userId(teamTogetherEntity.getUserId())
                    .teamId(teamTogetherEntity.getTeamId())
                    .teamTitle(teamTogetherEntity.getTeamTitle())
                    .build();
            teamTogetherDTOList.add(teamTogetherDTO);
        }
        return teamTogetherDTOList;
    }
    private String getAuthcode(){
        Random random = new Random();
        StringBuffer authCode = new StringBuffer();

        while(authCode.length()<13){
            if(random.nextBoolean()){
                authCode.append((char)((int)(random.nextInt(26))+65));
            }
            else{
                authCode.append(random.nextInt(10));
            }
        }
        return authCode.toString();
    }

}

