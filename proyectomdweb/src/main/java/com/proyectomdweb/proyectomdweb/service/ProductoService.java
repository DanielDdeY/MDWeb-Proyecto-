package com.proyectomdweb.proyectomdweb.service;

import com.proyectomdweb.proyectomdweb.dtos.ProductoDTO;
import com.proyectomdweb.proyectomdweb.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {
    
    // Métodos de lectura que devuelven DTOs (Listos para la vista)
    List<ProductoDTO> listarTodos();
    Optional<ProductoDTO> buscarPorId(Long id);
    List<ProductoDTO> buscarPorCategoriaId(Long categoriaId);
    List<ProductoDTO> buscarPorNombre(String nombre);
    List<ProductoDTO> filtrar(String genero, Long categoriaId);
    
    // Métodos de escritura
    // Nota: Por ahora recibe la Entidad, pero a futuro lo ideal es que reciba un DTO de entrada.
    ProductoDTO guardar(ProductoDTO productoDto);
    void eliminar(Long id);
    
    // Método interno para otras capas (ej. Ventas) que necesiten la Entidad real
    Producto obtenerEntidadPorId(Long id);
}