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

    @Enumerated(EnumType.STRING)
    @Column(name = "module_type")
    private ModuleType moduleType;

    @Column(name = "module_code", length = 7)
    private String moduleCode;

    public enum ModuleType {
        Core, GE
    }
}
