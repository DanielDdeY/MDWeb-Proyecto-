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
    
    //* Se usa "readOnly = true" para optimizar consultas de solo lectura *//
    @Transactional(readOnly = true)
    public List<Producto> listarTodos() {
        
        return productoRepository.findAllConCategoria();
    }
    
    @Transactional(readOnly = true)
    public Optional<Producto> buscarPorId(Long id) {
        
        return productoRepository.findByIdConCategoria(id);
    }
    
    //! Este NO lleva "readOnly = true" porque SÍ modifica la base de datos (escribe) !//
    @Transactional
    public Producto guardar(Producto producto) {

        return productoRepository.save(producto);
    }
    
    @Transactional
    public void eliminar(Long id) {
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
        // Si el id de categoría es 0 o null, se trata como nulo para que el Repo traiga todas
        Long idBusqueda = (categoriaId == null || categoriaId == 0) ? null : categoriaId;
        
        return productoRepository.filtrarPorGeneroYCategoria(genero, idBusqueda);
    }
}
