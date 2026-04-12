// Carga incial del documento
document.addEventListener("DOMContentLoaded", () => {

    /* POPUP PROMO */
    const popupmodal = document.getElementById("promo-modal");
    const closeModal = document.getElementById("close-modal");

    if (popupmodal) {
        setTimeout(() => {
            popupmodal.style.display = "flex";
        }, 1000);
    }
    function cerrarModal() {
        if (popupmodal) {
            popupmodal.style.display = "none";
        }
    }

    if (closeModal) {
        closeModal.addEventListener("click", () => {
            cerrarModal();
        });
    }
    // Cerrar modal si el usuario hace clic fuera del contenido
    if (popupmodal) {
        popupmodal.addEventListener("click", function (event) {
            // Si el usuario hace clic en el fondo (no en el contenido)
            if (event.target === closeModal) {
                cerrarModal();
            }
        });
    }

    /* MOVIMIENTO DEL BANNER (CADA 7s) */

    let currentImageIndex = 0;
    const images = document.querySelectorAll('.banner-image');
    function changeImage() {

        images[currentImageIndex].style.opacity = '0';
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].style.opacity = '1';
    }
    // Cambiar la imagen cada 7 segundos
    setInterval(changeImage, 7000);
    // Mostrar la primera imagen al cargar la página
    window.onload = function () {
        images[currentImageIndex].style.opacity = '1';
    };

    /* TEXTO CAMBIANTE */

    const textoDinamico     = document.getElementById("texto-dinamico");
    // Contar cuántos productos (para usar en las frases de oferta)
    const cantidadProductos = parseInt(localStorage.getItem("cantidadProductos")) || 0;;
    const precioOferta = 499;

    // Array de frases dinámicas
    let frases = [
        // 1) Oferta usando operadores aritméticos
        " Actualmente contamos con: " + cantidadProductos + " Productos. !Aprovecha en comprar ahora!",
        // 2) Frase personalizada 
        " “El gaming no es un hobby, es un estilo de vida.”",
        // 3) Segunda oferta usando operador 
        " Promoción limitada: compra dos productos y llévate el segundo a solo S/." + (precioOferta - 50),
        // 4) Llamado a contacto con enlace clickeable
        ' ¿Tienes dudas? <a href="productos.html" style="text-decoration: underline; font-weight: bold;">Contáctanos aquí</a>'
    ];
    let fraseIndex = 0;

    if (textoDinamico) {
        // Mostrar primera frase
        textoDinamico.innerHTML = frases[fraseIndex];
        // Cambiar cada 7 segundos
        setInterval(function () {
            fraseIndex = (fraseIndex + 1) % frases.length;
            textoDinamico.innerHTML = frases[fraseIndex];
        }, 7000);
    }

    /*  BOTONES DE COMPRA + ALERT + MODAL */

    // Seleccionamos todos los botones con clase "btn-comprar"
    const botonesCompra  = document.getElementsByClassName("btn-sabermas"); 
    // Referencias al modal
    const modal          = document.getElementById("modal-compra");
    const btnCerrarModal = document.getElementById("cerrar-modal");

    // Función para abrir modal
    function abrirModal() {
        if (modal) {
            modal.style.display = "block";
        }
    }
    // Función para cerrar modal
    function cerrarModal() {
        if (modal) {
            modal.style.display = "none";
        }
    }

    // Agregamos evento a todos los botones de compra
    for (let i = 0; i < botonesCompra.length; i++) { 
        botonesCompra[i].addEventListener("click", function (event) {
            event.preventDefault(); 
            // Método de salida: alert
            alert("Envíenos un mensaje mediante contacto.");
            // Mostramos el modal (ventana flotante)
            abrirModal();
        });
    }
    // Cerrar modal con botón "Cerrar"
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener("click", function () {
            cerrarModal();
        });
    }
    // Cerrar modal si el usuario hace clic fuera del contenido
    if (modal) {
        modal.addEventListener("click", function (event) {
            // Si el usuario hace clic en el fondo (no en el contenido)
            if (event.target === modal) {
                cerrarModal();
            }
        });
    }
    /* CARRITO LATERAL (productos.html) */

    const botonesComprar  = document.getElementsByClassName("btn-comprar");
    const carritoPanel    = document.getElementById("carrito-panel");
    const carritoToggle   = document.getElementById("carrito-toggle");
    const cerrarCarrito   = document.getElementById("cerrar-carrito");
    const contenedorItems = document.getElementById("carrito-items");
    const totalSpan       = document.getElementById("carrito-total");
    const btnVerCarrito   = document.getElementById("carrito-ver");

    let carrito = [];

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

    cargarCarrito();

    function abrirCarrito() {
        if (carritoPanel) {
            carritoPanel.style.right = "0";
        }
    }

    function cerrarCarritoPanel() {
        if (carritoPanel) {
            carritoPanel.style.right = "-320px";
        }
    }

    function actualizarCarrito() {
        if (!contenedorItems || !totalSpan) {
            guardarCarrito();
            return;
        }

        contenedorItems.innerHTML = "";
        let total = 0;

        carrito.forEach(function (item, index) {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const div = document.createElement("div");
            div.style.borderBottom = "1px solid #eee";
            div.style.padding = "6px 0";
            div.style.display = "flex";
            div.style.flexDirection = "column";
            div.dataset.index = index;

            div.innerHTML = `
                <strong>${item.nombre}</strong>
                <span>Cant: 
                <button class="btn-restar" style="margin:0 4px; padding:0 4px;">-</button>
                <span class="cantidad">${item.cantidad}</span>
                <button class="btn-sumar" style="margin:0 4px; padding:0 4px;">+</button>
                </span>
                <span>Precio: S/ ${item.precio.toFixed(2)}</span>
                <span>Subtotal: S/ ${subtotal.toFixed(2)}</span>
                <button class="btn-eliminar" style="margin-top:4px; align-self:flex-end; border:1px solid #ccc; background:#f5f5f5; padding:2px 6px;">Eliminar</button>
                `;

            contenedorItems.appendChild(div);
        });

        totalSpan.textContent = total.toFixed(2);
        guardarCarrito();
    }

    function agregarProducto(nombre, precio, imagen) {
        let encontrado = null;

        for (let i = 0; i < carrito.length; i++) {
            if (carrito[i].nombre === nombre) {
                encontrado = carrito[i];
                break;
            }
        }

        if (encontrado) {
            encontrado.cantidad += 1;
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1,
                imagen: imagen || ""
            });
        }

        actualizarCarrito();
        abrirCarrito();
    }

    // Eventos para los botones "COMPRAR AHORA"
    for (let i = 0; i < botonesComprar.length; i++) {
        botonesComprar[i].addEventListener("click", function (e) {
            e.preventDefault();

            const boton = e.currentTarget;
            const nombre = boton.getAttribute("data-name");
            const precioStr = boton.getAttribute("data-price");
            const imagen = boton.getAttribute("data-image");
            const precio = parseFloat(precioStr) || 0;
            agregarProducto(nombre, precio, imagen);
        });
    }

    if (carritoToggle) {
        carritoToggle.addEventListener("click", function () {
            if (carritoPanel.style.right === "0px" || carritoPanel.style.right === "0") {
                cerrarCarritoPanel();
            } else {
                abrirCarrito();
            }
        });
    }

    if (cerrarCarrito) {
        cerrarCarrito.addEventListener("click", cerrarCarritoPanel);
    }

    if (btnVerCarrito) {
        btnVerCarrito.addEventListener("click", function () {
            window.location.href = "carrito.html";
        });
    }

    if (contenedorItems) {
        contenedorItems.addEventListener("click", function (e) {
            const target  = e.target;
            const itemDiv = target.closest("div[data-index]");
            if (!itemDiv) return;

            const index   = parseInt(itemDiv.dataset.index);

            if (target.classList.contains("btn-sumar")) {
                carrito[index].cantidad += 1;
                actualizarCarrito();
            } else if (target.classList.contains("btn-restar")) {
                carrito[index].cantidad -= 1;
                if (carrito[index].cantidad <= 0) {
                    carrito.splice(index, 1);
                }
                actualizarCarrito();
            } else if (target.classList.contains("btn-eliminar")) {
                carrito.splice(index, 1);
                actualizarCarrito();
            }
        });
        // Al entrar a productos.html, pintamos lo que ya estaba en el carrito (si hay)
        actualizarCarrito();
    }

    /* ==========================
       CARRITO EN carrito.html
    ========================== */
    const listaPagina      = document.getElementById("carrito-lista");
    const totalPagina      = document.getElementById("carrito-total-page");
    const carritoVacio     = document.getElementById("carrito-vacio");
    const carritoContenido = document.getElementById("carrito-contenido");
    const btnIrPago        = document.getElementById("btn-ir-pago");

    if (listaPagina && totalPagina && carritoVacio && carritoContenido) {
        cargarCarrito();

        if (carrito.length === 0) {
            carritoVacio.style.display = "block";
            carritoContenido.style.display = "none";
        } else {
            carritoVacio.style.display = "none";
            carritoContenido.style.display = "grid";

            let total = 0;
            listaPagina.innerHTML = "";

            carrito.forEach(function (item, index) {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;

                const div = document.createElement("article");
                div.className = "carrito-item";
                div.dataset.index = index;

                div.innerHTML = `
                    <img src="${item.imagen || "assets/images/producto_1.png"}" alt="${item.nombre}">
                    <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>Precio: S/ ${item.precio.toFixed(2)}</p>
                    <div class="carrito-item-controles">
                    <button class="btn-restar-pagina">-</button>
                    <span>Cantidad: <span class="cantidad">${item.cantidad}</span></span>
                    <button class="btn-sumar-pagina">+</button>
                    <span>Subtotal: S/ ${subtotal.toFixed(2)}</span>
                    <button class="btn-eliminar-pagina">Eliminar</button>
                    </div>
                    </div>
                    `;
                listaPagina.appendChild(div);
            });

            totalPagina.textContent = total.toFixed(2);

            listaPagina.addEventListener("click", function (e) {
                const target  = e.target;
                const itemDiv = target.closest(".carrito-item");
                if (!itemDiv) return;
                const index = parseInt(itemDiv.dataset.index);

                if (target.classList.contains("btn-sumar-pagina")) {
                    carrito[index].cantidad += 1;
                } else if (target.classList.contains("btn-restar-pagina")) {
                    carrito[index].cantidad -= 1;
                    if (carrito[index].cantidad <= 0) {
                        carrito.splice(index, 1);
                    }
                } else if (target.classList.contains("btn-eliminar-pagina")) {
                    carrito.splice(index, 1);
                }

                guardarCarrito();
                window.location.reload(); // recargar para simplificar actualización
            });
        }

        if (btnIrPago) {
            btnIrPago.addEventListener("click", function () {
                window.location.href = "pago.html";
            });
        }
    }

    /* WIZARD EN pago.html */
    const botonesSiguiente = document.querySelectorAll(".btn-siguiente");
    const botonesAnterior  = document.querySelectorAll(".btn-anterior");

    botonesSiguiente.forEach(boton => {
        boton.addEventListener("click", () => {
            const pasoDestino = boton.dataset.to;
            mostrarPaso(pasoDestino);
        });
    });

    botonesAnterior.forEach(boton => {
        boton.addEventListener("click", () => {
            const pasoDestino = boton.dataset.to;
            mostrarPaso(pasoDestino);
        });
    });

    function mostrarPaso(numPaso) {
        // Ocultar todos los contenidos
        document.querySelectorAll(".paso-contenido").forEach(paso => {
                 paso.classList.remove("paso-activo");
        });

        // Quitar activo de todos los indicadores
        document.querySelectorAll(".paso-indicador").forEach(indicador => {
            indicador.classList.remove("paso-activo");
        });

        // Mostrar contenido del paso actual
        document.querySelector(`.paso-contenido[data-step="${numPaso}"]`).classList.add("paso-activo");

        // Marcar indicador del paso actual
        document.querySelector(`.paso-indicador[data-step="${numPaso}"]`).classList.add("paso-activo");
    }

    /* --- LÓGICA DE BOLETA / FACTURA --- */

    const radiosComprobante = document.querySelectorAll('input[name="tipo_comprobante"]');
    const camposBoleta      = document.getElementById("campos-boleta");
    const camposFactura     = document.getElementById("campos-factura");

    radiosComprobante.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "boleta") {
                camposBoleta.style.display = "block";
                camposFactura.style.display = "none";
            } else if (e.target.value === "factura") {
                camposBoleta.style.display = "none";
                camposFactura.style.display = "block";
            }
        });
    });

    /* --- LÓGICA DE MODALES DE PAGO --- */

    const botonesPago   = document.querySelectorAll(".btn-pago");
    const modales       = document.querySelectorAll(".modal");
    const botonesCerrar = document.querySelectorAll(".modal-cerrar");

    // Abrir modal
    botonesPago.forEach(boton => {
        boton.addEventListener("click", () => {
            const idModal = boton.dataset.modal;
            document.getElementById(idModal).classList.add("modal-activo");
        });
    });

    // Cerrar modal con el botón 'X'
    botonesCerrar.forEach(boton => {
        boton.addEventListener("click", () => {
            boton.closest(".modal").classList.remove("modal-activo");
        });
    });

    // Cerrar modal haciendo clic fuera del contenido
    modales.forEach(modal => {
        modal.addEventListener("click", (e) => {
            // Si se hace clic directamente en el fondo oscuro (el modal)
            if (e.target === modal) {
                modal.classList.remove("modal-activo");
            }
        });
    });

});