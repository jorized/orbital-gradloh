package com.gradlohbackend.orbital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "PrimaryMajorRequirements")
@Data
public class PrimaryMajorRequirement {

    @Id
    @Column(name = "primary_major", length = 45)
    private String primaryMajor;

    @Column(name = "module_type", length = 45)
    private String moduleType;

    @Id
    @Column(name = "module_code", length = 8)
    private String moduleCode;


}
