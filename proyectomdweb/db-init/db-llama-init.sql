-- 1. Tabla de Usuarios
CREATE TABLE usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(60) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    password        VARCHAR(100) NOT NULL,
    telefono        VARCHAR(12),
    direccion       TEXT,
    fecha_registro  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Categorías
CREATE TABLE categorias (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(20) NOT NULL
);

-- 3. Tabla de Productos (Catálogo general)
CREATE TABLE productos (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id    INT,
    nombre          VARCHAR(40) NOT NULL,
    genero          VARCHAR(10) NOT NULL,
    imagen_url      VARCHAR(255) NOT NULL, 
    precio_base     DECIMAL(8, 2) NOT NULL, 
    disponibilidad  BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- 4. Tabla de Detalles (Inventario Real / SKU)
CREATE TABLE producto_detalles (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    producto_id     INT NOT NULL,
    nombre_completo VARCHAR(70) NOT NULL,
    codigo          VARCHAR(20) UNIQUE NOT NULL, 
    imagen_url       VARCHAR(255) NOT NULL,
    marca           VARCHAR(20) NOT NULL,
    talla           VARCHAR(10) NOT NULL,
    color           VARCHAR(20) NOT NULL,
    descripcion     VARCHAR(100) NOT NULL,
    stock           INT DEFAULT 0,
    precio_base     DECIMAL(8, 2) NOT NULL,
    precio_adicional DECIMAL(7, 2) DEFAULT 0.00, 
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- 5. Tabla de Pedidos (Cabecera de la intención de compra)
CREATE TABLE pedidos (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT NOT NULL,
    total           DECIMAL(8, 2) NOT NULL,
    estado          ENUM('PENDIENTE', 'PAGADO', 'ENVIADO', 'CANCELADO') DEFAULT 'PENDIENTE',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 6. Tabla de Detalles de Pedido (Lo que el cliente puso en el carrito)
CREATE TABLE pedido_detalles (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id           INT NOT NULL,
    producto_detalle_id INT NOT NULL, 
    cantidad            INT NOT NULL,
    precio_unitario     DECIMAL(10, 2) NOT NULL,
    fecha_pedido        DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_detalle_id) REFERENCES producto_detalles(id)
);

-- 7. Tabla de Ventas (Cabecera del comprobante)
CREATE TABLE ventas (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id           INT NOT NULL UNIQUE,
    tipo_comprobante    ENUM('BOLETA', 'FACTURA') NOT NULL,
    serie_correlativo   VARCHAR(20) NOT NULL, -- Ej: B001-000145
    metodo_pago         ENUM('EFECTIVO', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'YAPE', 'PAYPAL') NOT NULL,
    fecha_emision       DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal            DECIMAL(8, 2) NOT NULL,
    igv                 DECIMAL(8, 2) NOT NULL,     
    total               DECIMAL(8, 2) NOT NULL,  
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE RESTRICT
);

-- 8. Tabla de Detalles de Venta (Las líneas dentro de la boleta)
CREATE TABLE ventas_detalles (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    venta_id            INT NOT NULL,
    producto_detalle_id INT NOT NULL,
    cantidad            INT NOT NULL,
    precio_unitario     DECIMAL(8, 2) NOT NULL,
    subtotal            DECIMAL(8, 2) NOT NULL, -- cantidad * precio_unitario
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_detalle_id) REFERENCES producto_detalles(id)
);


-- INSERCIONES (1 por tabla)

-- 1. Insertar Usuario
INSERT INTO usuarios (nombre, email, password, telefono, direccion) 
VALUES ('Usuario1', 'usuario1@email.com', 'contra_123', '919191919', 'Av. ubicacion, Lima');

-- 2. Insertar Categoría
INSERT INTO categorias (nombre) 
VALUES ('Sudaderas');

-- 3. Insertar Producto
INSERT INTO productos (categoria_id, nombre, genero, imagen_url, precio_base, disponibilidad) 
VALUES (
    1, 
    'Sudadera con Cappucha', 
    'Unisex', 
    'https://images.pexels.com/photos/23522986/pexels-photo-23522986.jpeg',
    89.90, 
    TRUE
),
(
    1, 
    'Camisa Prueba', 
    'Unisex', 
    'https://images.pexels.com/photos/9637777/pexels-photo-9637777.jpeg',
    51.50, 
    TRUE
);

-- 4. Insertar variantes del Producto (apuntando al producto_id = 1)
INSERT INTO producto_detalles (
    producto_id, nombre_completo, codigo, imagen_url, marca, talla, color, descripcion, stock, precio_base, precio_adicional
) 
VALUES 
-- Variante 1: La original (Talla M, Color Negro, Marca de la tienda)
(
    1, 
    'Sudadera Negra Capucha M - La Moda te Llama', 
    'SUD-NEG-M-LMLL', 
    'https://images.pexels.com/photos/23522986/pexels-photo-23522986.jpeg', 
    'La Moda te Llama', 
    'M', 
    'Negro', 
    'Sudadera de algodón premium corte regular', 
    20, 
    89.90, 
    0.00
),

-- Variante 2: Cambia la Talla (Talla XL) y tiene un precio adicional por mas tela
(
    1, 
    'Sudadera Negra Capucha XL - La Moda te Llama', 
    'SUD-NEG-XL-LMLL', 
    'https://thumbs.dreamstime.com/b/sudadera-negra-con-capucha-vista-plana-rodeada-de-rocas-oscuras-presentaci%C3%B3n-ropa-408719254.jpg', 
    'La Moda te Llama', 
    'XL', 
    'Negro', 
    'Sudadera de algodón premium oversize', 
    10, 
    89.90, 
    15.00 -- Cuesta 15 soles más
),

-- Variante 3: Cambia la Marca y el Color (Versión Gris de Adidas)
(
    1, 
    'Sudadera Gris Capucha M - Adidas', 
    'SUD-GRI-M-ADI', 
    'https://thumbs.dreamstime.com/b/sudadera-negra-con-capucha-vista-plana-rodeada-de-rocas-oscuras-presentaci%C3%B3n-ropa-408719254.jpg', 
    'Adidas', 
    'M', 
    'Gris', 
    'Sudadera deportiva ligera', 
    5, 
    89.90, 
    25.00 -- Cuesta 25 soles más por la marca
);

-- 5. Insertar Pedido
INSERT INTO pedidos (usuario_id, total, estado) 
VALUES (1, 150.00, 'PAGADO');

-- 6. Insertar Detalle de Pedido
INSERT INTO pedido_detalles (pedido_id, producto_detalle_id, cantidad, precio_unitario) 
VALUES (1, 1, 1, 150.00);

-- 7. Insertar Venta
INSERT INTO ventas (pedido_id, tipo_comprobante, serie_correlativo, metodo_pago, subtotal, igv, total) 
VALUES (1, 'BOLETA', 'B001-000045', 'YAPE', 127.12, 22.88, 150.00);

-- 8. Insertar Detalle de Venta
INSERT INTO ventas_detalles (
    venta_id, 
    producto_detalle_id, 
    cantidad, 
    precio_unitario, 
    subtotal
) 
VALUES (
    1,          -- Corresponde al ID de la venta que acabamos de crear
    1,          -- ID del producto variante (Ej: Sudadera Negra M)
    1,          -- Llevó 1 unidad
    127.12,     -- Precio unitario sin IGV
    127.12      -- Subtotal de esta línea (1 x 127.12)
);