/* ==========================
   LÓGICA DE PAGO 
   ========================== */

document.addEventListener("DOMContentLoaded", function() {
    const contenedorResumen = document.getElementById("pago-productos-lista");
    const totalSpan = document.getElementById("pago-total");
    const checkoutForm = document.getElementById("checkout-form");
    const cardDetails = document.getElementById("card-details");
    const walletDetails = document.getElementById("wallet-details");
    const radioMetodos = document.querySelectorAll('input[name="payment_method"]');

    let carrito = [];

    // 1. Cargar datos del localStorage
    function cargarResumen() {
        const data = localStorage.getItem("carritoLlama");
        if (data) {
            carrito = JSON.parse(data);
        }

        if (carrito.length === 0) {
            contenedorResumen.innerHTML = "<p>No hay productos en tu bolsa.</p>";
            // Redirigir si intentan entrar a pagar con carrito vacío
            setTimeout(() => { window.location.href = "productos.html"; }, 2000);
            return;
        }

        renderizarItems();
    }

    // 2. Mostrar productos en el lateral
    function renderizarItems() {
        contenedorResumen.innerHTML = "";
        let total = 0;

        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const div = document.createElement("div");
            div.className = "d-flex justify-content-between align-items-center mb-3";
            div.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 5px;" class="me-2">
                    <div>
                        <h6 class="mb-0" style="font-size: 0.9rem;">${item.nombre}</h6>
                        <small class="text-muted">Cant: ${item.cantidad}</small>
                    </div>
                </div>
                <span class="fw-bold">S/ ${subtotal.toFixed(2)}</span>
            `;
            contenedorResumen.appendChild(div);
        });

        totalSpan.textContent = total.toFixed(2);
    }

    // 3. Alternar visibilidad de métodos de pago
    radioMetodos.forEach(radio => {
        radio.addEventListener("change", function() {
            if (this.value === "wallet") {
                cardDetails.classList.add("d-none");
                walletDetails.classList.remove("d-none");
                // Quitar 'required' de los inputs de tarjeta para que el form sea válido
                cardDetails.querySelectorAll('input').forEach(i => i.required = false);
            } else {
                cardDetails.classList.remove("d-none");
                walletDetails.classList.add("d-none");
                cardDetails.querySelectorAll('input').forEach(i => i.required = true);
            }
        });
    });

    // 4. Manejo del Envío del Formulario
  checkoutForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Evitamos que la página se recargue

        if (!checkoutForm.checkValidity()) {
            e.stopPropagation();
            checkoutForm.classList.add("was-validated");
            return; // Si faltan datos (como el nombre), detenemos todo aquí
        } 
        
        // --- 1. RECOLECTAR DATOS DEL FORMULARIO ---
        // Buscamos los inputs de la sección de "Datos de Envío"
        const inputsEnvio = document.querySelectorAll('.form-section:first-of-type input');
        const nombre = inputsEnvio[0].value;
        const telefono = inputsEnvio[1].value;
        const direccion = inputsEnvio[2].value;

        const metodoPago = document.querySelector('input[name="payment_method"]:checked').value;

        // Calculamos el total usando el carrito actual
        const totalPagar = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        // --- 2. ARMAR EL PAQUETE JSON ---
        // Los nombres de la izquierda deben coincidir EXACTAMENTE con tu CheckoutRequestDTO en Java
        const payload = {
            clienteNombre: nombre,
            clienteTelefono: telefono,
            clienteDireccion: direccion,
            metodoPago: metodoPago,
            total: parseFloat(totalPagar.toFixed(2)),
            items: carrito.map(item => ({
                nombre: item.nombre,
                precio: parseFloat(item.precio),
                cantidad: parseInt(item.cantidad)
            }))
        };

        // --- 3. EFECTOS VISUALES (Desactivar botón para evitar doble clic) ---
        const btnSubmit = document.querySelector("button[type='submit']");
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Procesando...`;
        btnSubmit.disabled = true;

        // --- 4. ENVIAR A SPRING BOOT VÍA AJAX ---
        fetch('/pedidos/procesar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                // El servidor de Java respondió "OK", la venta se guardó en MySQL
                localStorage.removeItem("carritoLlama");
                window.location.href = "/"; // Te lleva al inicio de la tienda
            } else {
                // Si Java detecta un error (ej. falta un dato), lanzamos error
                throw new Error('El servidor rechazó la operación');
            }
        })
        .catch(error => {
            // Si el servidor está apagado o hubo un error en Java
            console.error("Detalle del error:", error);
            // ESTO TE MOSTRARÁ EL MOTIVO REAL EN PANTALLA
            alert("Error del servidor: \n" + error.message);
            // Restauramos el botón a su estado normal
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.disabled = false;
        });

        checkoutForm.classList.add("was-validated");
    });

    // Formateador de fecha de vencimiento (MM/YY)
    const inputVenc = document.getElementById("input-venc");
    if(inputVenc) {
        inputVenc.addEventListener("input", function(e) {
            let v = this.value.replace(/\D/g, ''); 
            if (v.length > 2) v = v.substring(0,2) + '/' + v.substring(2,4); 
            this.value = v;
        });
    }

    cargarResumen();
});