package com.proyectomdweb.proyectomdweb.controller;

import com.proyectomdweb.proyectomdweb.model.Producto;
import com.proyectomdweb.proyectomdweb.model.Categoria;
import com.proyectomdweb.proyectomdweb.service.ProductoService;
import com.proyectomdweb.proyectomdweb.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/productos") // Todas las rutas de gestión empezarán por aquí
@RequiredArgsConstructor
public class AdminProductoController {

    private final ProductoService productoService;
    private final CategoriaService categoriaService;

    // --- (R) LEER: Muestra una tabla estilo Excel para el administrador ---
    @GetMapping
    public String listarProductosAdmin(Model model) {
        model.addAttribute("productos", productoService.listarTodos());
        return "admin/lista-productos"; 
    }

    // --- (C) CREAR: Muestra el formulario vacío ---
    @GetMapping("/nuevo")
    public String mostrarFormularioDeCrear(Model model) {
    model.addAttribute("producto", new Producto());
    // Enviamos la lista de categorías para el dropdown
    model.addAttribute("categorias", categoriaService.listarTodas()); 
    return "admin/formulario-producto";
    }   

    // --- (C) CREAR / (U) ACTUALIZAR: Guarda los datos en la BD ---
    @PostMapping("/guardar")
    public String guardarProducto(@ModelAttribute Producto producto) {
        // Thymeleaf llena este 'producto' con lo que escribiste en la web y lo guarda
        productoService.guardar(producto);
        return "redirect:/admin/productos"; // Te regresa a la tabla al terminar
    }

    // --- (U) ACTUALIZAR: Muestra el formulario con los datos llenos ---
    @GetMapping("/editar/{id}")
    public String mostrarFormularioDeEditar(@PathVariable Long id, Model model) {
        Producto productoExistente = productoService.buscarPorId(id).orElse(null);
        model.addAttribute("producto", productoExistente);
        model.addAttribute("categorias", categoriaService.listarTodas()); 
        return "admin/formulario-producto"; // Usamos el mismo HTML que para crear
    }

    // --- (D) ELIMINAR: Borra la prenda de la BD ---
    @GetMapping("/eliminar/{id}")
    public String eliminarProducto(@PathVariable Long id) {
        productoService.eliminar(id);
        return "redirect:/admin/productos";
    }

}