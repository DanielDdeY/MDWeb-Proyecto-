document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "carritoLlama";

    const contenedorResumen = document.getElementById("pago-productos-lista");
    const totalSpan = document.getElementById("pago-total");
    const totalHidden = document.getElementById("input-total-hidden");
    const checkoutForm = document.getElementById("checkout-form");
    const direccionEntrega = document.getElementById("direccion-entrega");
    const facturaFields = document.getElementById("factura-fields");
    const deliveryFields = document.querySelectorAll(".delivery-field");
    const invoiceFields = document.querySelectorAll(".invoice-field");
    const tipoEntregaRadios = document.querySelectorAll('input[name="tipoEntrega"]');
    const tipoComprobanteRadios = document.querySelectorAll('input[name="tipoComprobante"]');
    const submitButton = checkoutForm?.querySelector('button[type="submit"]');

    let carrito = [];
    let redirectOnModalClose = "";

    initModal();
    cargarResumen();
    initDeliveryToggle();
    initInvoiceToggle();
    initSubmitValidation();

    function cargarResumen() {
        try {
            carrito = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (error) {
            carrito = [];
        }

        if (!carrito.length) {
            if (contenedorResumen) {
                contenedorResumen.innerHTML = `
                    <p class="checkout-empty-message">
                        No hay productos en tu bolsa.
                    </p>`;
            }
            if (submitButton) submitButton.disabled = true;
            setTotal(0);
            showCheckoutModal(
                "Tu bolsa está vacía",
                "Agrega productos antes de continuar con el pago.",
                "/productos"
            );
            return;
        }

        renderizarItems();
    }

    function renderizarItems() {
        if (!contenedorResumen) return;

        contenedorResumen.innerHTML = "";
        let total = 0;

        carrito.forEach((item) => {
            const cantidad = Number(item.cantidad || 0);
            const precio = Number(item.precio || 0);
            const subtotal = precio * cantidad;
            const nombre = escapeHTML(item.nombre || "Producto");
            const imagen = escapeHTML(item.imagen || "");
            total += subtotal;

            const div = document.createElement("div");
            div.className = "checkout-summary-item";
            div.innerHTML = `
                <div class="checkout-summary-item-media">
                    <img src="${imagen}" alt="${nombre}">
                    <div>
                        <h4>${nombre}</h4>
                        <small>Cantidad: ${cantidad}</small>
                    </div>
                </div>
                <span class="checkout-summary-price">S/ ${subtotal.toFixed(2)}</span>
            `;
            contenedorResumen.appendChild(div);
        });

        setTotal(total);
    }

    function setTotal(total) {
        const formatted = Number(total || 0).toFixed(2);
        if (totalSpan) totalSpan.textContent = formatted;
        if (totalHidden) totalHidden.value = formatted;
    }

    function initDeliveryToggle() {
        if (!tipoEntregaRadios.length || !direccionEntrega) return;

        function updateDeliveryState() {
            const selected = document.querySelector('input[name="tipoEntrega"]:checked')?.value;
            const isPickup = selected === "PICKUP";

            direccionEntrega.classList.toggle("is-hidden", isPickup);
            direccionEntrega.setAttribute("aria-hidden", String(isPickup));
            deliveryFields.forEach((field) => {
                field.required = !isPickup && field.id !== "clienteReferencia";
                if (isPickup) field.value = "";
            });
        }

        tipoEntregaRadios.forEach((radio) => radio.addEventListener("change", updateDeliveryState));
        updateDeliveryState();
    }

    function initInvoiceToggle() {
        if (!tipoComprobanteRadios.length || !facturaFields) return;

        function updateInvoiceState() {
            const selected = document.querySelector('input[name="tipoComprobante"]:checked')?.value;
            const needsInvoice = selected === "FACTURA";

            facturaFields.classList.toggle("is-hidden", !needsInvoice);
            facturaFields.setAttribute("aria-hidden", String(!needsInvoice));
            invoiceFields.forEach((field) => {
                field.required = needsInvoice;
                if (!needsInvoice) field.value = "";
            });
        }

        tipoComprobanteRadios.forEach((radio) => radio.addEventListener("change", updateInvoiceState));
        updateInvoiceState();
    }

    function initSubmitValidation() {
        if (!checkoutForm) return;

        checkoutForm.addEventListener("submit", (event) => {
            setTotal(totalSpan?.textContent || 0);

            if (!carrito.length) {
                event.preventDefault();
                showCheckoutModal(
                    "Tu bolsa está vacía",
                    "Agrega productos antes de continuar con el pago.",
                    "/productos"
                );
                return;
            }

            if (!checkoutForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                checkoutForm.classList.add("was-validated");
                showCheckoutModal(
                    "Faltan algunos datos",
                    "Revisa los campos marcados para completar tu compra."
                );
                return;
            }

            checkoutForm.classList.add("was-validated");
            if (submitButton) {
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Procesando pago';
                submitButton.disabled = true;
            }
        });
    }

    function initModal() {
        const modal = document.getElementById("checkout-feedback-modal");
        if (!modal) return;

        modal.querySelectorAll("[data-modal-close]").forEach((button) => {
            button.addEventListener("click", closeCheckoutModal);
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeCheckoutModal();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !modal.classList.contains("is-hidden")) {
                closeCheckoutModal();
            }
        });
    }

    function showCheckoutModal(title, message, redirectUrl = "") {
        const modal = document.getElementById("checkout-feedback-modal");
        const titleEl = document.getElementById("checkout-feedback-title");
        const messageEl = document.getElementById("checkout-feedback-message");
        if (!modal || !titleEl || !messageEl) return;

        redirectOnModalClose = redirectUrl;
        titleEl.textContent = title;
        messageEl.textContent = message;
        modal.classList.remove("is-hidden");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeCheckoutModal() {
        const modal = document.getElementById("checkout-feedback-modal");
        if (!modal) return;

        modal.classList.add("is-hidden");
        modal.setAttribute("aria-hidden", "true");

        if (redirectOnModalClose) {
            window.location.href = redirectOnModalClose;
        }
    }

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
