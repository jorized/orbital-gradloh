package com.gradlohbackend.orbital.service;

import com.gradlohbackend.orbital.config.SendGridConfig;
import com.gradlohbackend.orbital.entity.User;
import com.gradlohbackend.orbital.repository.UsersRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import java.io.IOException;

@Service
public class EmailService {

    private static final int OTP_LENGTH = 6;
    private static final long OTP_VALIDITY_DURATION_MINUTES = 5;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private SendGridConfig sendGridConfig;



    public void sendHtmlEmail(String to, String subject, String htmlContent) {

        Email toEmail = new Email(to);
        Email from = new Email("nusgradloh@gmail.com");
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, toEmail, content);

        SendGrid sg = sendGridConfig.getSendGrid();
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException ex) {
            System.out.println(ex.getMessage());
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
            System.out.println(e.getMessage());
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

