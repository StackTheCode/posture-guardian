package com.rk.postguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PostguardApplication {

	public static void main(String[] args) {
		SpringApplication.run(PostguardApplication.class, args);
	}

}
