package com.gradlohbackend.orbital.entity;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Users")
@Data
public class User implements UserDetails {

    @Id
    @Column(name = "email", length = 255, nullable = false)
    private String email;

    @Column(name = "folder_id", length = 255)
    private String folderId;

    @Column(name = "nickname", length = 45, nullable = false)
    private String nickname;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "refresh_token", length = 255)
    private String refreshToken;

    @Column(name = "reset_otp", length = 255)
    private String resetOtp;

    @Column(name = "reset_otp_exp")
    private Long resetOtpExp;

    @Column(name = "completed_onboard")
    private Boolean completedOnboard;

    @Column(name = "completed_tutorial")
    private Boolean completedTutorial;

    @Column(name = "enrolment_year", length = 9)
    private String enrolmentYear;

    @Column(name = "primary_major", length = 45, nullable = false)
    private String primaryMajor;

    @Column(name = "secondary_major", length = 45)
    private String secondaryMajor;

    @Column(name = "first_minor", length = 45)
    private String firstMinor;

    @Column(name = "second_minor", length = 45)
    private String secondMinor;

    @Column(name = "home_faculty", length = 45)
    private String homeFaculty;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "primary_major", referencedColumnName = "primary_major", insertable = false, updatable = false),
            @JoinColumn(name = "secondary_major", referencedColumnName = "secondary_major", insertable = false, updatable = false),
            @JoinColumn(name = "first_minor", referencedColumnName = "first_minor", insertable = false, updatable = false),
            @JoinColumn(name = "second_minor", referencedColumnName = "second_minor", insertable = false, updatable = false)
    })
    private Combination combination;

    public enum Role {
        USER,ADMIN
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
