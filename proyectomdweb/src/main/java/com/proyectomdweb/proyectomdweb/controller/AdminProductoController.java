package com.proyectomdweb.proyectomdweb.controller;

import com.proyectomdweb.proyectomdweb.model.Producto;
import com.proyectomdweb.proyectomdweb.dtos.ProductoDTO;
import com.proyectomdweb.proyectomdweb.mapper.ProductoMapper;
import com.proyectomdweb.proyectomdweb.model.Categoria;
import com.proyectomdweb.proyectomdweb.service.ProductoService;
import com.proyectomdweb.proyectomdweb.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/productos") // Todas las rutas de gestión empezarán por /admin 
@RequiredArgsConstructor
public class AdminProductoController {

    private final ProductoService   productoService;
    private final CategoriaService  categoriaService;
    private final ProductoMapper    productoMapper;

    // --- (R) LEER: Muestra una tabla estilo Excel para el administrador --- //
    @GetMapping
    public String listarProductosAdmin(Model model) {
        // Convertir la lista de entidades a lista de DTOs
        var listaDtos = productoService.listarTodos()
                .stream()
                .map(productoMapper::toDto)
                .toList();

        model.addAttribute("productos", listaDtos);
        return "admin/lista-productos";
    }

    // --- (C) CREAR: Muestra el formulario vacío --- //
    @GetMapping("/nuevo")
    public String mostrarFormularioDeCrear(Model model) {
        // Se envia un DTO vacio
        model.addAttribute("producto", new ProductoDTO(null, "", "Unisex", "", null, true, null, ""));
        // Enviar la lista de categorías
        model.addAttribute("categorias", categoriaService.listarTodas());
        return "admin/formulario-producto";
    }

    // --- (C) CREAR --> (U) ACTUALIZAR: Guarda los datos en la BD --- //
    @PostMapping("/guardar")
    public String guardarProducto(@ModelAttribute ProductoDTO productoDto) {
        // Thymeleaf llena este 'producto' con lo que se escribio en la web y lo guarda
        Categoria categoria = null;
        if (productoDto.categoriaId() != null) {
            categoria = categoriaService.buscarPorId(productoDto.categoriaId());
        }
        // Convertir DTO a Entidad y guardar
        Producto producto = productoMapper.toEntity(productoDto, categoria);
        productoService.guardar(producto);
        return "redirect:/admin/productos"; // Regresa al usuario a la tabla
    }

    // --- (U) ACTUALIZAR: Muestra el formulario con los datos llenos --- //
    @GetMapping("/editar/{id}")
    public String mostrarFormularioDeEditar(@PathVariable Long id, Model model) {
        Producto productoExistente = productoService.buscarPorId(id).orElse(null);
        model.addAttribute("producto", productoMapper.toDto(productoExistente));
        model.addAttribute("categorias", categoriaService.listarTodas());
        return "admin/formulario-producto"; // Se usa el mismo HTML que para crear
    }

    // --- (D) ELIMINAR: Borra la prenda de la BD --- //
    @GetMapping("/eliminar/{id}")
    public String eliminarProducto(@PathVariable Long id) {
        productoService.eliminar(id);
        return "redirect:/admin/productos";
    }

}