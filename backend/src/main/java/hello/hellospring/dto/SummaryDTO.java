package hello.hellospring.dto;

import hello.hellospring.model.Summary;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SummaryDTO {
    private Long summaryId;
    private Long userId;
    private String summaryStatsDate;
    private String summaryResult;

    public static SummaryDTO from(Summary summary){
        SummaryDTO summaryDTO = new SummaryDTO();
        summaryDTO.setSummaryId(summary.getSummaryId());
        summaryDTO.setUserId(summary.getUserId());
        summaryDTO.setSummaryStatsDate(summary.getSummaryStatsDate());
        summaryDTO.setSummaryResult(summary.getSummaryResult());
        return summaryDTO;
    }
}
