package com.b302.zizon.domain.oncast.entity;


import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "oncast")
public class Oncast {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oncast_Id")
    private Integer oncastId;


}
