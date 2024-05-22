package com.gradlohbackend.orbital.service;

import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.UsersRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;

@Service
public class EmailService {

    private static final int OTP_LENGTH = 6;
    private static final long OTP_VALIDITY_DURATION_MINUTES = 5;

    @Autowired
    private UsersRepo usersRepo;

    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setFrom("gradloh@demomailtrap.com");
            message.setSubject(subject);
            message.setText(body);
            logger.info("Sending email to {}", to);
            mailSender.send(message);
            logger.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            logger.error("Error sending email to {}", to, e);
        }
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            message.setFrom(new InternetAddress("gradloh@demomailtrap.com"));
            message.setRecipients(MimeMessage.RecipientType.TO, to);
            message.setSubject(subject);

            message.setContent(htmlContent, "text/html; charset=utf-8");

            mailSender.send(message);
        } catch (Exception e) {
            logger.error("Error sending email to {}", to, e);
        }


    }

    public String generateOTP() {
        StringBuilder otp = new StringBuilder(OTP_LENGTH);
        try {
            Random random = new Random();

            String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (int i = 0; i < OTP_LENGTH; i++) {
                otp.append(characters.charAt(random.nextInt(characters.length())));
            }

        } catch (Exception e) {
            logger.error("Error sending email to {}", e);
        }
        return otp.toString();

    }

    public long getOtpExpirationTime() {
        return Instant.now().plus(OTP_VALIDITY_DURATION_MINUTES, ChronoUnit.MINUTES).toEpochMilli();
    }

    public boolean validateOtp(String email, String otp) {
        Optional<User> userOptional = usersRepo.findByEmail(email);
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        if (user.getResetOTP().equals(otp) && Instant.now().toEpochMilli() < user.getResetOTPExp()) {
            return true;
        } else {
            return false;
        }
    }


}

