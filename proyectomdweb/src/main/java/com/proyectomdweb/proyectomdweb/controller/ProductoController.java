package com.proyectomdweb.proyectomdweb.controller;

import com.proyectomdweb.proyectomdweb.model.Producto;
import com.proyectomdweb.proyectomdweb.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller // Le dice a Spring que esta clase maneja peticiones web
@RequestMapping("/productos") // Todas las rutas aquí empezarán con /productos
@RequiredArgsConstructor // Lombok inyecta el servicio automáticamente
public class ProductoController {

    private final ProductoService productoService;

    // Cuando el usuario entre a http://localhost:8080/productos
@GetMapping
    public String listarTodosLosProductos(Model model) {
        
        // 1. El controlador le pide los productos al servicio
        List<Producto> listaProductos = productoService.listarTodos();
        
        // 2. Empaquetamos esos datos en el "Model" para enviarlos al HTML
        model.addAttribute("productos", listaProductos);
        
        // 3. Retorna el nombre del archivo HTML que se debe mostrar al usuario
        // (Spring buscará el archivo en src/main/resources/templates/productos/catalogo.html)
        return "productos"; 
    }
}