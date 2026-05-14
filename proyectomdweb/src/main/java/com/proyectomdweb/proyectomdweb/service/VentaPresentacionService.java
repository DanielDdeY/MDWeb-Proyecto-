package com.proyectomdweb.proyectomdweb.service;

import com.proyectomdweb.proyectomdweb.dtos.CheckoutRequestDTO;
import com.proyectomdweb.proyectomdweb.model.*;
import com.proyectomdweb.proyectomdweb.repository.PedidoRepository;
import com.proyectomdweb.proyectomdweb.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class VentaPresentacionService {

    private final PedidoRepository pedidoRepository;
    private final VentaRepository  ventaRepository;

    @Transactional
    public Venta registrarVentaRapida(CheckoutRequestDTO request) {
        
        // 1. Crea un Pedido "Simulado" para satisfacer la llave foránea
        Pedido pedidoNuevo = new Pedido();
        pedidoNuevo.setUsuarioId(1L);        
        pedidoNuevo.setTotal(request.total());   
        pedidoNuevo.setEstado(EstadoPedido.PAGADO); // SE marca como pagado directamente
        pedidoNuevo = pedidoRepository.save(pedidoNuevo);

        // 2. Cálculos Matemáticos (IGV 18% Perú)
        BigDecimal total = request.total();
        BigDecimal divisorIgv = new BigDecimal("1.18");
        BigDecimal subtotal = total.divide(divisorIgv, 2, RoundingMode.HALF_UP);
        // IGV = Total - Subtotal
        BigDecimal igv = total.subtract(subtotal);

        // 3. Genera número de boleta aleatorio (Ej: B001-001234)
        Random random = new Random();
        int correlativo = random.nextInt(999999);
        String numeroBoleta = String.format("B001-%06d", correlativo);

        // 4. Mapear el método de pago del frontend (card o wallet) al Enum de la BD
        MetodoPago metodoElegido = request.metodoPago().equals("wallet") ? 
                                   MetodoPago.YAPE : MetodoPago.TARJETA_CREDITO;

        // 5. Ensambla y guarda la Venta
        Venta venta = new Venta();
        venta.setPedido(pedidoNuevo);
        venta.setTipoComprobante(TipoComprobante.BOLETA);
        venta.setSerieCorrelativo(numeroBoleta);
        venta.setMetodoPago(metodoElegido);
        venta.setFechaEmision(LocalDateTime.now());
        venta.setSubtotal(subtotal);
        venta.setIgv(igv);
        venta.setTotal(total);

        return ventaRepository.save(venta);
    }
}
