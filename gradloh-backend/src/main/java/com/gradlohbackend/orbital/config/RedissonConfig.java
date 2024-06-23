package com.gradlohbackend.orbital.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.redisson.Redisson;
import org.redisson.api.RKeys;
import org.redisson.api.RMap;
import org.redisson.api.RedissonClient;
import org.redisson.codec.JsonJacksonCodec;
import org.redisson.config.Config;
import org.redisson.spring.cache.RedissonSpringCacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

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

    public void removeSpecificUserCache(String email) throws IOException {
        // Iterate over all keys
        Iterable<String> allKeys = redissonClient().getKeys().getKeys();
        Iterator<String> iterator = allKeys.iterator();

        while (iterator.hasNext()) {
            String key = iterator.next();
            // Check if the key corresponds to a map
            RMap<Object, Object> map = redissonClient().getMap(key);
            if (map != null) {
                // Remove the specific field from the map
                map.remove(email);
            }
        }
    }
}
