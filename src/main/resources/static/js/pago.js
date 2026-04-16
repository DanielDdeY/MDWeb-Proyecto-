/* ==========================
   LÓGICA DE PAGO (pago.js)
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
        if (!checkoutForm.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault();
            alert("¡Compra procesada con éxito! Gracias por confiar en La Moda te LLama.");
            localStorage.removeItem("carritoLlama"); // Limpiar carrito tras pagar
            window.location.href = "index.html"; // O una página de éxito
        }
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