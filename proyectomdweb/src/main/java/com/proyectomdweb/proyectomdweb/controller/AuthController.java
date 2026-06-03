package com.proyectomdweb.proyectomdweb.controller;

import com.proyectomdweb.proyectomdweb.dtos.UsuarioRegistroDTO;
import com.proyectomdweb.proyectomdweb.service.JwtService;
import com.proyectomdweb.proyectomdweb.service.UsuarioService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService    userDetailsService;
    private final JwtService            jwtService;
    private final UsuarioService        usuarioService;

    @GetMapping("/login")
    public String mostrarLogin() {
        return "login"; // vista login.html
    }

    @PostMapping("/login")
    public String procesarLogin(@RequestParam("username") String username, 
                                @RequestParam("password") String password, 
                                HttpServletResponse response) {
        try {
            // 1. Autenticar al usuario
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // 2. Crear Token JWT
            String token = jwtService.generarToken(userDetails);
            
            // 3. Almacenar en una Cookie Segura
            Cookie cookie = new Cookie("jwt_token", token);
            cookie.setHttpOnly(true);  // Protege contra ataques XSS (JS no puede leerla)
            cookie.setSecure(false);    // Cambiar a true si se usa HTTPS en producción
            cookie.setPath("/");          // Disponible en toda la aplicación
            cookie.setMaxAge(86400);  // Duración de 1 día
            response.addCookie(cookie);
            
            //  4. Verificar si es administrador
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(rol -> rol.getAuthority().equals("ROLE_ADMIN"));
            
            if (isAdmin) {
                return "redirect:/admin/dashboard"; // Ruta al panel de control de admin
            } 
            // 5. Mandar clientes normales al index.html de la tienda
            return "redirect:/"; 
        } catch (Exception e) {
            return "redirect:/auth/login?error=true"; // Error de credenciales
        }
    }
    // Metodo para cerrar sesión destruyendo la cookie
    @GetMapping("/logout")
    public String cerrarSesion(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt_token", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // Esto le dice al navegador: "Borra la cookie inmediatamente"
        response.addCookie(cookie);
        return "redirect:/";
    }

    //-- METODOS DE REGISTRO DE USUARIO --//

    @GetMapping("/registro")
    public String mostrarRegistro() {
        return "registro"; // Apunta a registro.html
    }

    @PostMapping("/registro")
    public String procesarRegistro(@Valid @ModelAttribute UsuarioRegistroDTO registroDTO) {

        // 1. Verificar si el correo ya está registrado
        if (usuarioService.existePorEmail(registroDTO.getEmail())) {
            return "redirect:/auth/registro?error=email";
        }
        // 2. El UsuarioService se encarga de mapear, encriptar y guardar internamente
        usuarioService.registrarNuevoUsuario(registroDTO);

        // 3. Redirigir al login con un mensaje de éxito
        return "redirect:/auth/login?exito=registro";
    }


        
}