package com.gradlohbackend.orbital.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Modules")
@Data
public class Module {

    @Id
    @Column(name = "module_code", length = 7, nullable = false)
    private String moduleCode;

    @Column(name = "module_name", length = 45, nullable = false)
    private String moduleName;

    @Column(name = "faculty", length = 45, nullable = false)
    private String faculty;

    @Column(name = "module_description", columnDefinition = "TEXT")
    private String moduleDescription;

    @Column(name = "module_credits", columnDefinition = "TINYINT")
    private Integer moduleCredits;

}
