package com.gradlohbackend.orbital.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "SecondaryMajorRequirements")
@Data
public class SecondaryMajorRequirement {

    @Id
    @Column(name = "secondary_major", length = 45, nullable = false)
    private String secondaryMajor;

    @Column(name = "module_code", length = 7)
    private String moduleCode;

}