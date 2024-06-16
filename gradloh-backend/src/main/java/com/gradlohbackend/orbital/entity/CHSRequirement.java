package com.gradlohbackend.orbital.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "CHSRequirements")
@Data
public class CHSRequirement {
    @Id
    @Column(name = "pillar", length = 45)
    private String pillar;

    @Id
    @Column(name = "module_code", length = 45)
    private String moduleCode;
}
