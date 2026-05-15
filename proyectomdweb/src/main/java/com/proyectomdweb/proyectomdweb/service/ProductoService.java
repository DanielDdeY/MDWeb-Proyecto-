package com.proyectomdweb.proyectomdweb.service;

import com.proyectomdweb.proyectomdweb.model.Producto;
import com.proyectomdweb.proyectomdweb.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoService {
    
    private final ProductoRepository productoRepository;
    
    @Transactional(readOnly = true)
    public List<Producto> listarTodos() {
        return productoRepository.findAllConCategoria();
    }
    
    @Transactional(readOnly = true)
    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findByIdConCategoria(id);
    }
    
    @Transactional
    public Producto guardar(Producto productoInput) {
        // Validaciones básicas
        if (productoInput.getNombre() == null || productoInput.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio.");
        }
        if (productoInput.getPrecioBase() == null || productoInput.getPrecioBase().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero.");
        }

        // Si es un producto nuevo (sin ID), simplemente guardamos
        if (productoInput.getId() == null) {
            return productoRepository.save(productoInput);
        }

        // Si es una actualización, cargamos el existente y solo copiamos los campos permitidos
        Producto existente = productoRepository.findById(productoInput.getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoInput.getId()));

        // Actualizar solo los campos que vienen del formulario (NO la lista de variantes)
        existente.setNombre(productoInput.getNombre());
        existente.setGenero(productoInput.getGenero());
        existente.setImagenUrl(productoInput.getImagenUrl());
        existente.setPrecioBase(productoInput.getPrecioBase());
        existente.setDisponibilidad(productoInput.getDisponibilidad());
        if (productoInput.getCategoria() != null) {
            existente.setCategoria(productoInput.getCategoria());
        }

        // Guardamos sin tocar las variantes
        return productoRepository.save(existente);
    }
    
    @Transactional
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: el producto no existe.");
        }
        productoRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Producto> buscarPorCategoriaId(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }
    
    @Transactional(readOnly = true)
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Transactional(readOnly = true)
    public List<Producto> filtrar(String genero, Long categoriaId) {
        Long idBusqueda = (categoriaId == null || categoriaId == 0) ? null : categoriaId;
        return productoRepository.filtrarPorGeneroYCategoria(genero, idBusqueda);
    }
}