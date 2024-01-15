package hello.hellospring.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Builder
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor
@Table(name = "Todo")
public class Todo {
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    private String id;

    private String title;

    private String time;

    private boolean done;

    private String userCode;

}
