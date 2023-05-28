package com.condor.breadtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


/**
 * This class performs some serverside configuration
 * used for live deployment
 */
@Configuration
@SpringBootApplication
public class BreadTrackerApplication implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(BreadTrackerApplication.class, args);
	}

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS").allowedOrigins("http://localhost:5173").allowCredentials(true);
    }
}
