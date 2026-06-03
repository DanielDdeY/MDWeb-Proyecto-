package com.proyectomdweb.proyectomdweb.controller;

import com.proyectomdweb.proyectomdweb.dtos.CheckoutRequestDTO;
import com.proyectomdweb.proyectomdweb.service.VentaPresentacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor 
public class PedidoController {
    /* 
    private final VentaPresentacionService ventaService;

    @PostMapping("/procesar")
    public ResponseEntity<String> procesarPago(@RequestBody CheckoutRequestDTO request) {
        try {
            // Llamamos a al método para la presentación
            ventaService.registrarVentaRapida(request);
            
            return ResponseEntity.ok("Venta registrada exitosamente en BD");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al procesar: " + e.getMessage());
        }
    } */
}
