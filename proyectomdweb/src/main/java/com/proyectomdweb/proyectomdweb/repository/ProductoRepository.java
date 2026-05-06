package com.proyectomdweb.proyectomdweb.repository;

import com.proyectomdweb.proyectomdweb.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // Al usar JOIN FETCH, traemos el producto y su categoría en un solo viaje a la BD
    @Query("SELECT p FROM Producto p JOIN FETCH p.categoria")
    List<Producto> findAllConCategoria();
    
    // Lo mismo, pero para buscar un producto específico por su ID
    @Query("SELECT p FROM Producto p JOIN FETCH p.categoria WHERE p.id = :id")
    Optional<Producto> findByIdConCategoria(Long id);

    // Spring Data JPA es lo suficientemente inteligente para entender esto:
    // Busca dentro de la propiedad "categoria" y matchea su "id"
    List<Producto> findByCategoriaId(Long categoriaId); 
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}

