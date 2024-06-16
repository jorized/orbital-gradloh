package com.gradlohbackend.orbital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "SecondaryMajorRequirements")
@Data
public class SecondaryMajorRequirement {

    @Id
    @Column(name = "secondary_major", length = 45)
    private String secondaryMajor;

    @Column(name = "module_type", length = 20)
    private String moduleType;

    @Id
    @Column(name = "module_code", length = 8)
    private String moduleCode;
}
