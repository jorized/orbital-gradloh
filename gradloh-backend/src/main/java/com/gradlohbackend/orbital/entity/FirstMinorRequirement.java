package com.gradlohbackend.orbital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "FirstMinorRequirements")
@Data
public class FirstMinorRequirement {

    @Id
    @Column(name = "first_minor", length = 45)
    private String firstMinor;

    @Column(name = "module_code", length = 8)
    private String moduleCode;
}
