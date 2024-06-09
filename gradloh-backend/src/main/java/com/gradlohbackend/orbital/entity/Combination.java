package com.gradlohbackend.orbital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Combinations")
@Data
public class Combination {

    @Id
    @Column(name = "primary_major", length = 45)
    private String primaryMajor;

    @Column(name = "secondary_major", length = 45)
    private String secondaryMajor;

    @Column(name = "first_minor", length = 45)
    private String firstMinor;

    @Column(name = "second_minor", length = 45)
    private String secondMinor;

    @Column(name="total_mcs_required", length = 7)
    private String totalMcsRequired;
}
