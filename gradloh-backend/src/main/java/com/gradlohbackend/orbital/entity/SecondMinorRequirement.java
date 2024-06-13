package com.gradlohbackend.orbital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "SecondMinorRequirements")
@Data
public class SecondMinorRequirement  {

    @Id
    @Column(name = "second_minor", length = 45, nullable = false)
    private String secondMinor;

    @Column(name = "module_code", length = 7)
    private String moduleCode;
}
