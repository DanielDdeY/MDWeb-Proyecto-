document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "carritoLlama";
    const PROMO_KEY = "lmllPromoSeenAt";
    const PROMO_INTERVAL_DAYS = 14;

    initPromoModal();
    initBannerCarousel();
    initProductStats();
    initDynamicTicker();
    initCartPanel();

    function initPromoModal() {
        const popup = document.getElementById("promo-modal");
        if (!popup) return;

        const closeButtons = popup.querySelectorAll("#close-modal, .close-btn, .btn-lmll");
        const lastShown = Number(localStorage.getItem(PROMO_KEY) || 0);
        const daysSinceShown = (Date.now() - lastShown) / (1000 * 60 * 60 * 24);
        const shouldShow = !lastShown || daysSinceShown >= PROMO_INTERVAL_DAYS;

        function closePromo() {
            popup.style.display = "none";
            popup.setAttribute("aria-hidden", "true");
            localStorage.setItem(PROMO_KEY, String(Date.now()));
        }

        if (shouldShow) {
            window.setTimeout(() => {
                popup.style.display = "flex";
                popup.setAttribute("aria-hidden", "false");
            }, 900);
        } else {
            popup.style.display = "none";
            popup.setAttribute("aria-hidden", "true");
        }

        closeButtons.forEach((button) => button.addEventListener("click", closePromo));
        popup.addEventListener("click", (event) => {
            if (event.target === popup) closePromo();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && popup.style.display === "flex") closePromo();
        });
    }

    function initBannerCarousel() {
        const images = document.querySelectorAll(".banner-image");
        const dots = document.querySelectorAll(".banner-dot");
        if (!images.length || !dots.length) return;

        let current = 0;

        function goTo(index) {
            images[current]?.classList.remove("active");
            dots[current]?.classList.remove("active");
            current = (index + images.length) % images.length;
            images[current]?.classList.add("active");
            dots[current]?.classList.add("active");
        }

        let timer = window.setInterval(() => goTo(current + 1), 7000);

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                window.clearInterval(timer);
                goTo(index);
                timer = window.setInterval(() => goTo(current + 1), 7000);
            });
        });
    }

    function initProductStats() {
        const el = document.getElementById("stat-productos");
        if (!el) return;

        const count = parseInt(localStorage.getItem("cantidadProductos"), 10) || 0;
        el.textContent = count > 0 ? count : "24";
    }

    function initDynamicTicker() {
        const el = document.getElementById("texto-dinamico");
        if (!el) return;

        const count = parseInt(localStorage.getItem("cantidadProductos"), 10) || 0;
        const frases = [
            `Actualmente contamos con <strong>${count || 24} productos</strong>. Aprovecha hoy.`,
            "La moda peruana también puede sentirse premium, cómoda y diaria.",
            "Promoción limitada: compra dos y llévate el segundo a solo <strong>S/ 449</strong>.",
            'Explora novedades desde <a href="/productos">nuestra colección</a>.'
        ];
        let index = 0;

        el.style.transition = "opacity .4s";
        el.innerHTML = frases[0];

        window.setInterval(() => {
            el.style.opacity = "0";
            window.setTimeout(() => {
                index = (index + 1) % frases.length;
                el.innerHTML = frases[index];
                el.style.opacity = "1";
            }, 400);
        }, 7000);
    }

    function initCartPanel() {
        const carritoPanel = document.getElementById("carrito-panel");
        const carritoOverlay = document.getElementById("carrito-overlay");
        const carritoToggle = document.getElementById("carrito-toggle");
        const cerrarCarrito = document.getElementById("cerrar-carrito");
        const contenedorItems = document.getElementById("carrito-items");
        const totalSpan = document.getElementById("carrito-total");
        const btnVerCarrito = document.getElementById("carrito-ver");
        const cartCount = document.getElementById("cart-count");

        let carrito = [];

        function cargarCarrito() {
            try {
                carrito = JSON.parse(localStorage.getItem(CART_KEY)) || [];
            } catch (error) {
                carrito = [];
            }
        }

        function guardarCarrito() {
            localStorage.setItem(CART_KEY, JSON.stringify(carrito));
        }

        function abrirCarrito() {
            if (carritoPanel) carritoPanel.style.right = "0";
            carritoOverlay?.classList.add("visible");
            carritoOverlay?.setAttribute("aria-hidden", "false");
        }

        function cerrarCarritoPanel() {
            if (carritoPanel) carritoPanel.style.right = "-320px";
            carritoOverlay?.classList.remove("visible");
            carritoOverlay?.setAttribute("aria-hidden", "true");
        }

        function actualizarBadge() {
            if (!cartCount) return;

            const cantidad = carrito.reduce((total, item) => total + Number(item.cantidad || 0), 0);
            cartCount.textContent = cantidad;
            cartCount.hidden = cantidad <= 0;
        }

        function actualizarCarrito() {
            if (!contenedorItems || !totalSpan) {
                guardarCarrito();
                actualizarBadge();
                return;
            }

            contenedorItems.innerHTML = "";
            let total = 0;

            if (carrito.length === 0) {
                contenedorItems.innerHTML = `
                    <p class="carrito-empty">
                        Tu bolsa está vacía.<br>Agrega algo especial.
                    </p>`;
            }

            carrito.forEach((item, index) => {
                const subtotal = Number(item.precio || 0) * Number(item.cantidad || 0);
                total += subtotal;
                const nombre = escapeHTML(item.nombre || "Producto");
                const imagen = escapeHTML(item.imagen || "");

                const div = document.createElement("div");
                div.className = "carrito-item-row";
                div.dataset.index = index;
                div.innerHTML = `
                    <div class="cart-panel-item-media">
                        <img src="${imagen}" alt="${nombre}">
                        <div class="flex-grow-1">
                            <strong>${nombre}</strong>
                            <small>S/ ${Number(item.precio || 0).toFixed(2)}</small>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <div class="cant-controls">
                            <button class="btn-restar btn btn-sm btn-outline-lmll" type="button">-</button>
                            <span class="mx-2">${item.cantidad}</span>
                            <button class="btn-sumar btn btn-sm btn-outline-lmll" type="button">+</button>
                        </div>
                        <button class="btn-eliminar btn-remove-item" type="button">Eliminar</button>
                    </div>
                `;
                contenedorItems.appendChild(div);
            });

            totalSpan.textContent = total.toFixed(2);
            guardarCarrito();
            actualizarBadge();
        }

        document.addEventListener("click", (event) => {
            const botonComprar = event.target.closest(".product-overlay button");
            if (!botonComprar) return;

            event.preventDefault();

            const card = botonComprar.closest(".product-card-lmll");
            if (!card) return;

            const nombre = card.querySelector(".product-title")?.textContent.trim();
            const precioTexto = card.querySelector(".product-price")?.textContent || "";
            const precio = parseFloat(precioTexto.replace("S/", "").trim().split(" ")[0]) || 0;
            const imagen = card.querySelector("img")?.src || "";
            if (!nombre) return;

            const encontrado = carrito.find((item) => item.nombre === nombre);
            if (encontrado) {
                encontrado.cantidad += 1;
            } else {
                carrito.push({ nombre, precio, cantidad: 1, imagen });
            }

            actualizarCarrito();
            abrirCarrito();
        });

        carritoToggle?.addEventListener("click", () => {
            const isClosed = !carritoPanel || carritoPanel.style.right === "-320px" || carritoPanel.style.right === "";
            isClosed ? abrirCarrito() : cerrarCarritoPanel();
        });

        cerrarCarrito?.addEventListener("click", cerrarCarritoPanel);
        carritoOverlay?.addEventListener("click", cerrarCarritoPanel);
        btnVerCarrito?.addEventListener("click", () => {
            window.location.href = "/carrito";
        });

        contenedorItems?.addEventListener("click", (event) => {
            const target = event.target;
            const itemDiv = target.closest("div[data-index]");
            if (!itemDiv) return;

            const index = parseInt(itemDiv.dataset.index, 10);
            if (Number.isNaN(index) || !carrito[index]) return;

            if (target.classList.contains("btn-sumar")) {
                carrito[index].cantidad += 1;
            }

            if (target.classList.contains("btn-restar")) {
                carrito[index].cantidad -= 1;
                if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
            }

            if (target.classList.contains("btn-eliminar")) {
                carrito.splice(index, 1);
            }

            actualizarCarrito();
        });

        cargarCarrito();
        actualizarCarrito();
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
