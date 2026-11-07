package com.shivam.supportlyAi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class SupportlyAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SupportlyAiApplication.class, args);
	}

}
