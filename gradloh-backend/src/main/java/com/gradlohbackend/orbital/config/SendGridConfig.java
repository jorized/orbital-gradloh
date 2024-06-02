package com.gradlohbackend.orbital.config;

import com.sendgrid.SendGrid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SendGridConfig {

    @Value("${sendgrid.key}")
    private String key;

    @Bean
    public SendGrid getSendGrid() {
        return new SendGrid(key);
    }
}
