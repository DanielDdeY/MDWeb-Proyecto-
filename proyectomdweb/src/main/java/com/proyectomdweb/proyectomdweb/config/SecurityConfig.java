package com.proyectomdweb.proyectomdweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // 1. Las rutas de administración son estrictamente para el rol ADMIN
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // 2. Rutas públicas: Cualquiera puede entrar a ver la tienda y los recursos (CSS, JS, Imágenes)
                .requestMatchers("/", "/productos", "/carrito","/pago", "/css/**", "/img/**", "/js/**").permitAll()
                
                // 3. Todo lo demás (ej. todo lo que se va a agregar y testar) permitida
                .anyRequest().permitAll()
            )
            .formLogin(form -> form
                // Spring Boot generará una página de login automática
                .defaultSuccessUrl("/admin/productos", true)
                .permitAll()
            )
            .logout(logout -> logout
                .permitAll()
            );

        return http.build();
    }
    //*Quitar los comentarios para Validar el login *//
    //@Bean
    //public UserDetailsService userDetailsService() {
        // Se creo un usuario administrador temporal para pruebas
        //! En una fase posterior, esto se validará con la base de datos MySQL //
      //  UserDetails admin = User.builder()
        //    .username("admin")
          //  .password(passwordEncoder().encode("admin123"))
            //.roles("ADMIN")
            //.build();

       // return new InMemoryUserDetailsManager(admin);
    // }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}