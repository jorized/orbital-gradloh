package com.gradlohbackend.orbital.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.codec.JsonJacksonCodec;
import org.redisson.config.Config;
import org.redisson.spring.cache.RedissonSpringCacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;

@Configuration
@EnableCaching
public class RedissonConfig {

    @Bean
    public RedissonClient redissonClient() throws IOException {
        InputStream configFile = getClass().getClassLoader().getResourceAsStream("redisson.yaml");
        Config config = Config.fromYAML(configFile);

        ObjectMapper objectMapper = new ObjectMapper();
        config.setCodec(new JsonJacksonCodec(objectMapper));
        return Redisson.create(config);
    }

    @Bean
    public RedissonSpringCacheManager cacheManager(RedissonClient redissonClient) {
        return new RedissonSpringCacheManager(redissonClient);
    }
}
