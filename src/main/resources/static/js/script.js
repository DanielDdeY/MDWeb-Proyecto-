document.addEventListener("DOMContentLoaded", () => {
    /* --- POPUP PROMO --- */
    const popupmodal = document.getElementById("promo-modal");
    if (popupmodal) {
        setTimeout(() => { popupmodal.style.display = "flex"; }, 1000);
        document.getElementById("close-modal")?.addEventListener("click", () => popupmodal.style.display = "none");
    }

    /* --- BANNER DINÁMICO --- */
    let currentImageIndex = 0;
    const images = document.querySelectorAll('.banner-image');
    if (images.length > 0) {
        setInterval(() => {
            images[currentImageIndex].style.opacity = '0';
            currentImageIndex = (currentImageIndex + 1) % images.length;
            images[currentImageIndex].style.opacity = '1';
        }, 7000);
    }

    /* --- TEXTO DINÁMICO --- */
    const textoDinamico = document.getElementById("texto-dinamico");
    if (textoDinamico) {
        let frases = [
            "Descubre la próxima generación de moda peruana.",
            "“La moda no es un hobby, es un estilo de vida.”",
            "Promoción limitada: S/ 50 de descuento hoy."
        ];
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % frases.length;
            textoDinamico.innerHTML = frases[idx];
        }, 7000);
    }

    /* --- LÓGICA DEL CARRITO (CANTIDADES Y ELIMINAR) --- */
    document.addEventListener("click", (e) => {
        // SUMAR (+)
        if (e.target.classList.contains("btn-sumar-pagina") || e.target.innerText === '+') {
            const input = e.target.closest('.qty-control').querySelector('input');
            input.value = parseInt(input.value) + 1;
        }

        // RESTAR (-)
        if (e.target.classList.contains("btn-restar-pagina") || e.target.innerText === '-') {
            const input = e.target.closest('.qty-control').querySelector('input');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        }

        // ELIMINAR CON MODAL
        const btnEliminar = e.target.closest(".btn-remove-item");
        if (btnEliminar) {
            const fila = btnEliminar.closest(".carrito-full-item");
            const modalEl = document.getElementById('deleteModal');
            
            if (modalEl) {
                const modalConfirm = new bootstrap.Modal(modalEl);
                modalConfirm.show();

                document.getElementById('confirmDelete').onclick = function() {
                    fila.style.opacity = '0';
                    fila.style.transform = 'scale(0.8)';
                    fila.style.transition = '0.3s';
                    
                    setTimeout(() => {
                        fila.remove();
                        modalConfirm.hide();
                    }, 300);
                };
            }
        }
    });

    /* --- FORMULARIO DE PAGO --- */
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const paymentModal = document.getElementById('paymentModal');
            if (paymentModal) {
                new bootstrap.Modal(paymentModal).show();
            } else {
                alert("¡Pedido realizado con éxito!");
            }
        });
    }
});