package com.gradlohbackend.orbital.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Combinations")
@Data
public class Combination {

    @Id
    @Column(name = "primary_major", length = 45, nullable = false)
    private String primaryMajor;

    @Id
    @Column(name = "secondary_major", length = 45)
    private String secondaryMajor;

    @Id
    @Column(name = "first_minor", length = 45)
    private String firstMinor;

    @Id
    @Column(name = "second_minor", length = 45)
    private String secondMinor;

    @Column(name = "total_mcs_required", length = 7, nullable = false)
    private String totalMcsRequired;

}
