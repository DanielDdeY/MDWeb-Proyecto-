document.addEventListener("DOMContentLoaded", () => {
    /* --- POPUP PROMO --- */
    const popupmodal = document.getElementById("promo-modal");
    if (popupmodal) {
        setTimeout(() => { popupmodal.style.display = "flex"; }, 1000);
        document.getElementById("close-modal")?.addEventListener("click", () => popupmodal.style.display = "none");
    }

    /* ─── BANNER CARRUSEL ─────────────────────────────── */
    (function () {
        const images = document.querySelectorAll('.banner-image');
        const dots   = document.querySelectorAll('.banner-dot');
        let current = 0;

        function goTo(index) {
            images[current].classList.remove('active');
              dots[current].classList.remove('active');
            current = (index + images.length) % images.length;
            images[current].classList.add('active');
              dots[current].classList.add('active');
        }

        let timer = setInterval(() => goTo(current + 1), 7000);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(timer);
                goTo(i);
                timer = setInterval(() => goTo(current + 1), 7000);
            });
        });
    })();

    /* ─── STAT PRODUCTOS ─────────────────────────────── */
    (function () {
        const el  = document.getElementById('stat-productos');
        const cnt = parseInt(localStorage.getItem('cantidadProductos')) || 0;
        if (el) el.textContent = cnt > 0 ? cnt : '24';
    })();
    /* ─── TICKER DINÁMICO ─────────────────────────────── */
    (function () {
        const el = document.getElementById('texto-dinamico');
        if (!el) return;

        const cant = parseInt(localStorage.getItem('cantidadProductos')) || 0;
        const frases = [
            'Actualmente contamos con <strong>' + cant + ' productos</strong>. ¡Aprovecha hoy!',
            '"La moda no es un hobby, es un <em>estilo de vida</em>."',
            'Promoción limitada: compra dos y llévate el segundo a solo <strong>S/ 449</strong>',
            '¿Tienes dudas? <a href="carrito.html" style="color:var(--accent-2);text-decoration:underline;">Contáctanos aquí</a>'
        ];
        let idx = 0;

        function siguiente() {
            el.style.opacity = '0';
            setTimeout(() => {
                idx = (idx + 1) % frases.length;
                el.innerHTML = frases[idx];
                el.style.opacity = '1';
            }, 400);
        }

        el.style.transition = 'opacity .4s';
        el.innerHTML = frases[0];
        setInterval(siguiente, 7000);
    })();

    /* ==========================
    CARRITO LATERAL (products.html)
 ========================== */
    // 1. Cambiamos el selector para que busque los botones dentro de tus overlays de Bootstrap
    const botonesComprar  = document.querySelectorAll(".product-overlay button");
    const carritoPanel    = document.getElementById("carrito-panel");
    const carritoToggle   = document.getElementById("carrito-toggle");
    const cerrarCarrito   = document.getElementById("cerrar-carrito");
    const contenedorItems = document.getElementById("carrito-items");
    const totalSpan       = document.getElementById("carrito-total");
    const btnVerCarrito   = document.getElementById("carrito-ver");

    let carrito = [];

    // --- PERSISTENCIA ---
    function cargarCarrito() {
        const data = localStorage.getItem("carritoLlama");
        if (data) {
            try {
                carrito = JSON.parse(data) || [];
            } catch (e) {
                carrito = [];
            }
        }
    }

    function guardarCarrito() {
        localStorage.setItem("carritoLlama", JSON.stringify(carrito));
    }

    // --- LÓGICA DE INTERFAZ ---
    function abrirCarrito() {
        if (carritoPanel) carritoPanel.style.right = "0";
    }

    function cerrarCarritoPanel() {
        if (carritoPanel) carritoPanel.style.right = "-320px";
    }

    function actualizarCarrito() {
        if (!contenedorItems || !totalSpan) {
            guardarCarrito();
            return;
        }

        contenedorItems.innerHTML = "";
        let total = 0;

        if (carrito.length === 0) {
            contenedorItems.innerHTML = `
      <p style="font-size:.82rem; color:#888; text-align:center; padding:1.5rem 0;">
        Tu bolsa está vacía.<br>¡Añade algo especial!
      </p>`;
        }

        carrito.forEach(function (item, index) {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const div = document.createElement("div");
            div.className          = "carrito-item-row"; // Puedes darle estilo en CSS
            div.style.borderBottom = "1px solid #eee";
            div.style.padding      = "10px 0";
            div.dataset.index      = index;

            div.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center;">
        <img src="${item.imagen}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
        <div style="flex-grow:1;">
          <strong style="display:block; font-size:0.9rem;">${item.nombre}</strong>
          <small>S/ ${item.precio.toFixed(2)}</small>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <div class="cant-controls">
          <button class="btn-restar btn btn-sm btn-light">-</button>
          <span class="mx-2">${item.cantidad}</span>
          <button class="btn-sumar btn btn-sm btn-light">+</button>
        </div>
        <button class="btn-eliminar text-danger" style="background:none; border:none; font-size:0.8rem;">Eliminar</button>
      </div>
    `;
            contenedorItems.appendChild(div);
        });

        totalSpan.textContent = total.toFixed(2);
        guardarCarrito();
    }

    // --- AGREGAR PRODUCTOS (EXTRACCIÓN DEL DOM) ---
    botonesComprar.forEach(boton => {
        boton.addEventListener("click", function (e) {
            e.preventDefault();

            // Buscamos la tarjeta contenedora para extraer info
            const   card = e.currentTarget.closest(".product-card-lmll");
            const nombre = card.querySelector(".product-title").textContent.trim();

            let precioTexto  = card.querySelector(".product-price").textContent;
            let precioLimpio = precioTexto.replace("S/", "").trim().split(" ")[0];
            
            const precio = parseFloat(precioLimpio) || 0;
            const imagen = card.querySelector("img").src;

            // Lógica de agregar al array
            let encontrado = carrito.find(item => item.nombre === nombre);

            if (encontrado) {
                encontrado.cantidad += 1;
            } else {
                carrito.push({ nombre, precio, cantidad: 1, imagen });
            }

            actualizarCarrito();
            abrirCarrito();
        });
    });

    // --- EVENTOS DE BOTONES DEL PANEL ---
    if (carritoToggle) {
        carritoToggle.addEventListener("click", () => {
            const isClosed = carritoPanel.style.right === "-320px" || carritoPanel.style.right === "";
            isClosed ? abrirCarrito() : cerrarCarritoPanel();
        });
    }

    if (cerrarCarrito) cerrarCarrito.addEventListener("click", cerrarCarritoPanel);

    if (btnVerCarrito) {
                       btnVerCarrito.addEventListener("click", () => window.location.href = "carrito.html");
    }

    if (contenedorItems) {
        contenedorItems.addEventListener("click", function (e) {
            const target  = e.target;
            const itemDiv = target.closest("div[data-index]");
            if (!itemDiv) return;
            const index = parseInt(itemDiv.dataset.index);

            if (target.classList.contains("btn-sumar")) {
                carrito[index].cantidad += 1;
            } else if (target.classList.contains("btn-restar")) {
                carrito[index].cantidad--;
                if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
            } else if (target.classList.contains("btn-eliminar")) {
                carrito.splice(index, 1);
            }
            actualizarCarrito();
        });
    }

    // Inicialización
    cargarCarrito();
    actualizarCarrito();

    /* --- LÓGICA DEL CARRITO (CANTIDADES Y ELIMINAR) --- */
    const contenedorResumen = document.getElementById("pago-productos-lista");
    const totalPagar        = document.getElementById("pago-total");
    const checkoutForm      = document.getElementById("checkout-form");
    const cardDetails       = document.getElementById("card-details");
    const walletDetails     = document.getElementById("wallet-details");
    const radioMetodos      = document.querySelectorAll('input[name="payment_method"]');

    let carritohtml = [];

    // 1. Cargar datos del localStorage
    function cargarResumen() {
        const data = localStorage.getItem("carritoLlama");
        if (data) {
            carritohtml = JSON.parse(data);
        }

        if (carritohtml.length === 0) {
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

        carritohtml.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const div = document.createElement("div");
            div.className = "d-flex justify-content-between align-items-center mb-3";
            div.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 45px; height: 45px; 
                        object-fit: cover; border-radius: 5px;" class="me-2">
                    <div>
                        <h6 class="mb-0" style="font-size: 0.9rem;">${item.nombre}</h6>
                        <small class="text-muted">Cant: ${item.cantidad}</small>
                    </div>
                </div>
                <span class="fw-bold">S/ ${subtotal.toFixed(2)}</span>
            `;
            contenedorResumen.appendChild(div);
        });

        totalPagar.textContent = total.toFixed(2);
    }

    // 3. Alternar visibilidad de métodos de pago
    radioMetodos.forEach(radio => {
        radio.addEventListener("change", function () {
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
    checkoutForm.addEventListener("submit", function (e) {
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

});