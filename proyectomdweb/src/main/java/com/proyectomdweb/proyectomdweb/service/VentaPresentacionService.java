package com.proyectomdweb.proyectomdweb.service;

import com.proyectomdweb.proyectomdweb.model.Usuario;
import com.proyectomdweb.proyectomdweb.model.Venta;
import java.math.BigDecimal;

public interface VentaPresentacionService {
    
    Venta crearVentaInicialPendiente(BigDecimal total, String tipoComprobanteStr, Usuario usuario);
    
    void completarVentaExitosa(Venta venta, String metodoUsadoPayU);
    
    // NUEVOS MÉTODOS REQUERIDOS PARA EL DASHBOARD REAL
    BigDecimal obtenerTotalIngresosReales();
    
    long obtenerCantidadPedidosPendientes();
}
