package com.proyectomdweb.proyectomdweb.repository;

import com.proyectomdweb.proyectomdweb.model.EstadoPedido;
import com.proyectomdweb.proyectomdweb.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // Spring Genera automáticamente: SELECT COUNT(*) FROM pedidos WHERE estado = ?;
    long countByEstado(EstadoPedido estado);
}


