package com.sms.society;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
@EnableDiscoveryClient
public class SocietyApplication {

	public static void main(String[] args) {
		SpringApplication.run(SocietyApplication.class, args);
	}

	@Bean
	public CommandLineRunner fixComplaintsTable(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE complaints MODIFY COLUMN FlatId BIGINT NULL");
				System.out.println(">>> Successfully altered complaints table: FlatId is now NULLABLE <<<");
			} catch (Exception e) {
				System.err.println(">>> Notice altering complaints table: " + e.getMessage() + " <<<");
			}
		};
	}

}
