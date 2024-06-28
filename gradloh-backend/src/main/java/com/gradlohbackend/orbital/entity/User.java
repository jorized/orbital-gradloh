package com.gradlohbackend.orbital.entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cache;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "nickname", length = 45, nullable = false)
    private String nickname;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "reset_otp")
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

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    public enum Role {
        USER, ADMIN
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
