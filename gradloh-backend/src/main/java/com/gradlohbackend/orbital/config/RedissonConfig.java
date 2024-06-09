package com.gradlohbackend.orbital.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class RedissonConfig {

    @Bean
    public RedissonClient redissonClient() throws IOException {
        InputStream configFile = getClass().getClassLoader().getResourceAsStream("redisson.yaml");
        Config config = Config.fromYAML(configFile);
        return Redisson.create(config);
    }
}
