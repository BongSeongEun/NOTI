package hello.hellospring.model;


import hello.hellospring.dto.DiaryDTO;
import hello.hellospring.dto.SummaryDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@NoArgsConstructor
@Table(name = "summary")
public class Summary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Long summaryId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "summary_stats_date")
    private String summaryStatsDate;

    @Column(name = "summary_result")
    private String summaryResult;

    public static Summary toSaveEntity(SummaryDTO summaryDTO){
        Summary summary = new Summary();
        summary.setSummaryId(summaryDTO.getSummaryId());
        summary.setUserId(summaryDTO.getUserId());
        summary.setSummaryStatsDate(summaryDTO.getSummaryStatsDate());
        summary.setSummaryResult(summaryDTO.getSummaryResult());
        return summary;
    }

    public static Summary toUpdateEntity(SummaryDTO summaryDTO){
        Summary summary = new Summary();
        summary.setSummaryId(summaryDTO.getSummaryId());
        summary.setUserId(summaryDTO.getUserId());
        summary.setSummaryStatsDate(summaryDTO.getSummaryStatsDate());
        summary.setSummaryResult(summaryDTO.getSummaryResult());
        return summary;
    }
}

