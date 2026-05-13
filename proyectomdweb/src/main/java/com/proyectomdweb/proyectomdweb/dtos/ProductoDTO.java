package com.proyectomdweb.proyectomdweb.dtos;

import java.math.BigDecimal;

public record ProductoDTO(
    Long        id, 
    String      nombre, 
    String      genero,
    String      imagenUrl,
    BigDecimal  precioBase,
    Boolean     disponibilidad,
    Long        categoriaId,      // Solo el ID para el formulario
    String      categoriaNombre   // Solo el nombre para la tabla
) {}
