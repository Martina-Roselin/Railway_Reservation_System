package com.example.demo.config;

import com.example.demo.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Apply the new CORS configuration from the bean below
            .cors(withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/trains", "/api/trains/search", "/api/trains/details/**").permitAll()

                // Admin-only rules
                .requestMatchers(HttpMethod.POST, "/api/trains").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/trains/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/trains/**").hasRole("ADMIN")
                .requestMatchers("/api/bookings/admin/**").hasRole("ADMIN")

                // User-only rules
                .requestMatchers("/api/bookings/**").hasRole("USER")
                .requestMatchers("/api/payment/**").hasRole("USER")

                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 2. Create the CORS configuration bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from your frontend development server
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        // Allow all standard HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Allow credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this configuration to all paths in your application
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}