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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/productos")
@RequiredArgsConstructor
public class AdminProductoController {

    private final ProductoService   productoService;
    private final CategoriaService  categoriaService;
    private final ProductoMapper    productoMapper;

    // --- (R) LEER: Muestra una tabla estilo Excel para el administrador --- //
    @GetMapping
    public String listarProductosAdmin(Model model) {
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
        model.addAttribute("producto", new ProductoDTO(null, "", "Unisex", "", null, true, null, ""));
        model.addAttribute("categorias", categoriaService.listarTodas());
        return "admin/formulario-producto";
    }

    // --- (C) CREAR --> (U) ACTUALIZAR: Guarda los datos en la BD --- //
    @PostMapping("/guardar")
    public String guardarProducto(@ModelAttribute ProductoDTO productoDto,
                                  RedirectAttributes redirectAttributes) {
        try {
            // Validar que la categoría exista
            Categoria categoria = null;
            if (productoDto.categoriaId() != null) {
                categoria = categoriaService.buscarPorId(productoDto.categoriaId());
            } else {
                redirectAttributes.addFlashAttribute("error", "Debe seleccionar una categoría.");
                return "redirect:/admin/productos/nuevo";
            }
            
            // Convertir DTO a Entidad y guardar
            Producto producto = productoMapper.toEntity(productoDto, categoria);
            productoService.guardar(producto);
            redirectAttributes.addFlashAttribute("exito", "Producto guardado correctamente.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al guardar: " + e.getMessage());
            return "redirect:/admin/productos/nuevo";
        }
        return "redirect:/admin/productos";
    }

    // --- (U) ACTUALIZAR: Muestra el formulario con los datos llenos --- //
    @GetMapping("/editar/{id}")
    public String mostrarFormularioDeEditar(@PathVariable Long id, Model model,
                                            RedirectAttributes redirectAttributes) {
        var productoOpt = productoService.buscarPorId(id);
        if (productoOpt.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "El producto con ID " + id + " no existe.");
            return "redirect:/admin/productos";
        }
        Producto productoExistente = productoOpt.get();
        model.addAttribute("producto", productoMapper.toDto(productoExistente));
        model.addAttribute("categorias", categoriaService.listarTodas());
        return "admin/formulario-producto";
    }

    // --- (D) ELIMINAR: Borra la prenda de la BD --- //
    @GetMapping("/eliminar/{id}")
    public String eliminarProducto(@PathVariable Long id,
                                   RedirectAttributes redirectAttributes) {
        try {
            productoService.eliminar(id);
            redirectAttributes.addFlashAttribute("exito", "Producto eliminado.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "No se pudo eliminar: " + e.getMessage());
        }
        return "redirect:/admin/productos";
    }
}