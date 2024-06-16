package com.gradlohbackend.orbital.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "SingleMajorSamplePlan")
@Data
public class SingleMajorSamplePlan {

    @Id
    @Column(name = "primary_major", length = 45)
    private String primaryMajor;

    @Id
    @Column(name = "folder_name")
    private Byte folderName;

    @Id
    @Column(name = "module_code", length = 8)
    private String moduleCode;

    @Column(name = "major_condition", length = 8)
    private String majorCondition;
}
