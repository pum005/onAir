package com.b302.zizon.domain.oncast.entity;

import com.b302.zizon.domain.music.entity.ThemeEnum;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "oncast_create_data")
public class OncastCreateData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oncast_create_data_id")
    private Long oncastCreateDateId;

    @Column(nullable = false)
    private String title;

    @Column(name = "theme")
    @Enumerated(EnumType.STRING)
    private ThemeEnum theme;

    @Column(name = "story")
    private String story;

    @Column(nullable = false)
    private String djName;

}
