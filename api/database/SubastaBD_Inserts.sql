USE subastabd;

-- =====================================================
-- TABLA: categoria
-- =====================================================
INSERT INTO categoria (nombreCategoria) VALUES
('Superdeportivos'),
('SUV de lujo'),
('Clásicos de colección'),
('Sedanes premium'),
('Ediciones limitadas');

-- =====================================================
-- TABLA: condicion (SOLO NUEVO Y USADO)
-- =====================================================
INSERT INTO condicion (descripcionCondicion) VALUES
('Nuevo'),
('Usado');

-- =====================================================
-- TABLA: estado_objeto
-- =====================================================
INSERT INTO estado_objeto (descripcionEstado) VALUES
('Disponible'),
('En subasta'),
('Vendido');
-- =====================================================
-- TABLA: estado_pago
-- =====================================================
INSERT INTO estado_pago (descripcionPago) VALUES
('Pendiente'),
('Confirmado');

-- =====================================================
-- TABLA: estado_subasta
-- =====================================================
INSERT INTO estado_subasta (descripcionEstado) VALUES
('Activa'),
('Finalizada'),
('Cancelada');

-- =====================================================
-- TABLA: estado_usuario
-- =====================================================
INSERT INTO estado_usuario (descripcionEstado) VALUES
('Activo'),
('Bloqueado');

-- =====================================================
-- TABLA: rol
-- =====================================================
INSERT INTO rol (nombreRol) VALUES
('Administrador'),
('Vendedor'),
('Comprador');

-- =====================================================
-- TABLA: usuario
-- =====================================================
INSERT INTO usuario (nombreUsuario,emailUsuario,contrasenna,IdRol,IdEstado) VALUES
('Alejandro Ruiz','alejandro@autosvip.com','123',2,1),
('Fernando Mora','fernando@clientesvip.com','123',3,1),
('Ricardo Salas','ricardo@coleccionistas.com','123',3,1),
('Daniel Castro','daniel@luxcars.com','123',2,1),
('Jorge Navarro','jorge@inversionistas.com','123',3,1);

-- =====================================================
-- TABLA: objeto
-- =====================================================
INSERT INTO objeto 
(nombreObjeto,descripcionObjeto,idCondicion,idEstadoObjeto,idVendedor)
VALUES
('Ferrari 488 Spider','Ferrari rojo, motor V8, 3,000 km',2,1,1),
('Lamborghini Urus','SUV Lamborghini negro mate',1,1,4),
('Porsche 911 Turbo S','Modelo 2023 color plata',1,1,1),
('Rolls Royce Phantom','Interior cuero blanco personalizado',2,1,4),
('Ford Mustang Shelby GT500','Edición limitada 2022',2,1,1);

-- =====================================================
-- TABLA: objeto_categoria
-- =====================================================
INSERT INTO objeto_categoria VALUES
(1,1),
(2,2),
(3,1),
(4,4),
(5,5);

-- =====================================================
-- TABLA: objeto_imagen
-- =====================================================
INSERT INTO objeto_imagen (idObjeto,nombreImagen) VALUES
(1,'ferrari488.jpg'),
(2,'urus.jpg'),
(3,'porsche911.jpg'),
(4,'phantom.jpg'),
(5,'shelbygt500.jpg');

-- =====================================================
-- TABLA: subasta
-- =====================================================
INSERT INTO subasta 
(idObjeto,idVendedor,precioBase,incrementoMinimo,fechaInicio,fechaCierre,idEstadoSubasta)
VALUES
(1,1,280000.00,5000.00,'2026-02-01 10:00:00','2026-02-15 10:00:00',1),
(2,4,350000.00,7000.00,'2026-02-01 12:00:00','2026-02-18 12:00:00',1),
(3,1,260000.00,4000.00,'2026-02-02 09:00:00','2026-02-16 09:00:00',1),
(4,4,500000.00,10000.00,'2026-02-03 14:00:00','2026-02-20 14:00:00',2),
(5,1,150000.00,3000.00,'2026-02-04 11:00:00','2026-02-22 11:00:00',2);

-- =====================================================
-- TABLA: puja
-- =====================================================
INSERT INTO puja (idSubasta,idUsuario,monto) VALUES
(1,2,285000.00),
(1,3,295000.00),
(2,5,360000.00),
(3,2,270000.00),
(4,3,520000.00);

-- =====================================================
-- TABLA: resultado_subasta
-- =====================================================
INSERT INTO resultado_subasta 
(idSubasta,idUsuarioGanador,idPujaGanadora,montoFinal)
VALUES
(4,3,5,520000.00),
(5,2,4,270000.00),
(1,3,2,295000.00),
(2,5,3,360000.00),
(3,2,4,270000.00);

-- =====================================================
-- TABLA: pago
-- =====================================================
INSERT INTO pago (idResultado,montoPagado,idEstadoPago) VALUES
(1,520000.00,2),
(2,270000.00,1),
(3,295000.00,2),
(4,360000.00,2),
(5,270000.00,1);

-- =====================================================
-- TABLA: recuperacion_contrasenna
-- =====================================================
INSERT INTO recuperacion_contrasenna 
(idUsuario,token,fechaExpiracion,usado) VALUES
(1,'VIPtoken1','2026-03-01 10:00:00',0),
(2,'VIPtoken2','2026-03-01 10:00:00',1),
(3,'VIPtoken3','2026-03-02 12:00:00',0),
(4,'VIPtoken4','2026-03-03 09:00:00',0),
(5,'VIPtoken5','2026-03-04 08:00:00',1);
