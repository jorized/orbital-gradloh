package com.gradlohbackend.orbital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class OrbitalApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrbitalApplication.class, args);
	}

}
