package com.proyectomdweb.proyectomdweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CheckoutController {

    @GetMapping("/pago")
    public String mostrarPaginaPago() {
        // Le dice a Spring que devuelva el archivo "pago.html" ubicado en templates
        return "pago"; 
    }
}