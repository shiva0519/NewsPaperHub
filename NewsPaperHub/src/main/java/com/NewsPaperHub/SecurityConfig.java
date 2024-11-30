package com.NewsPaperHub;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
	@Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
            .cors(cors -> cors.configurationSource(new CorsConfig().corsConfigurationSource())) // Enable CORS
            .authorizeHttpRequests(authorize -> 
                authorize
                    .anyRequest().permitAll() // Allow all requests without authentication (for testing)
            );
        return http.build();
    }
	
	@Bean
	public UserDetailsService userService() {
		UserDetails user1=User.withUsername("shiva").password("{noop}123").roles("user").build();
		UserDetails user2=User.withUsername("teja").password("{noop}456").roles("Admin").build();

		return new InMemoryUserDetailsManager(user1,user2);
		
	}
	
	
	
	
	
	
}
