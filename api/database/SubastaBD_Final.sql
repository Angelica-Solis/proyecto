-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `subastabd` DEFAULT CHARACTER SET utf8 ;
USE `subastabd` ;

-- -----------------------------------------------------
-- Table `categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categoria` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombreCategoria` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombreCategoria_UNIQUE` (`nombreCategoria` ASC)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `condicion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `condicion` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcionCondicion` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `descripcionCondicion_UNIQUE` (`descripcionCondicion` ASC)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `estado_objeto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estado_objeto` (
  `id` TINYINT(1) NOT NULL AUTO_INCREMENT,
  `descripcionEstado` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `descripcionEstado_UNIQUE` (`descripcionEstado` ASC)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `estado_pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estado_pago` (
  `id` TINYINT(1) NOT NULL AUTO_INCREMENT,
  `descripcionPago` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `estado_subasta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estado_subasta` (
  `id` TINYINT(1) NOT NULL AUTO_INCREMENT,
  `descripcionEstado` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `estado_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estado_usuario` (
  `id` TINYINT(1) NOT NULL AUTO_INCREMENT,
  `descripcionEstado` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `descripcionEstado_UNIQUE` (`descripcionEstado` ASC)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `rol`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rol` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombreRol` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombreRol_UNIQUE` (`nombreRol` ASC)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombreUsuario` VARCHAR(255) NOT NULL,
  `emailUsuario` VARCHAR(255) NOT NULL,
  `contrasenna` TEXT NOT NULL,
  `IdRol` INT(11) NOT NULL,
  `IdEstado` TINYINT(1) NOT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `emailUsuario_UNIQUE` (`emailUsuario` ASC),
  INDEX `fk_EstadoUsuario` (`IdEstado` ASC),
  INDEX `fk_UsuarioRol` (`IdRol` ASC),
  CONSTRAINT `fk_EstadoUsuario`
    FOREIGN KEY (`IdEstado`) REFERENCES `estado_usuario` (`id`),
  CONSTRAINT `fk_UsuarioRol`
    FOREIGN KEY (`IdRol`) REFERENCES `rol` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `objeto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `objeto` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombreObjeto` VARCHAR(255) NOT NULL,
  `descripcionObjeto` TEXT NOT NULL,
  `idCondicion` INT(11) NOT NULL,
  `idEstadoObjeto` TINYINT(1) NOT NULL,
  `idVendedor` INT(11) NOT NULL,
  `fechaRegistro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  INDEX `fk_Condicion` (`idCondicion` ASC),
  INDEX `fk_EstadoObjeto` (`idEstadoObjeto` ASC),
  INDEX `fk_Vendedor` (`idVendedor` ASC),
  CONSTRAINT `fk_Condicion`
    FOREIGN KEY (`idCondicion`) REFERENCES `condicion` (`id`),
  CONSTRAINT `fk_EstadoObjeto`
    FOREIGN KEY (`idEstadoObjeto`) REFERENCES `estado_objeto` (`id`),
  CONSTRAINT `fk_Vendedor`
    FOREIGN KEY (`idVendedor`) REFERENCES `usuario` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `objeto_categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `objeto_categoria` (
  `idObjeto` INT(11) NOT NULL,
  `idCategoria` INT(11) NOT NULL,
  PRIMARY KEY (`idObjeto`, `idCategoria`),
  INDEX `fk_idCategoria` (`idCategoria` ASC),
  CONSTRAINT `fk_idCategoria`
    FOREIGN KEY (`idCategoria`) REFERENCES `categoria` (`id`),
  CONSTRAINT `fk_idObjeto`
    FOREIGN KEY (`idObjeto`) REFERENCES `objeto` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `objeto_imagen`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `objeto_imagen` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idObjeto` INT(11) NOT NULL,
  `nombreImagen` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ObjetoImagen_Objeto` (`idObjeto` ASC),
  CONSTRAINT `fk_ObjetoImagen_Objeto`
    FOREIGN KEY (`idObjeto`) REFERENCES `objeto` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `subasta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subasta` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idObjeto` INT(11) NOT NULL,
  `idVendedor` INT(11) NOT NULL,
  `precioBase` DECIMAL(15,2) NOT NULL,
  `incrementoMinimo` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `fechaInicio` DATETIME NOT NULL,
  `fechaCierre` DATETIME NOT NULL,
  `idEstadoSubasta` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Subasta_Estado` (`idEstadoSubasta` ASC),
  INDEX `fk_Subasta_Objeto` (`idObjeto` ASC),
  INDEX `fk_Subasta_Vendedor` (`idVendedor` ASC),
  CONSTRAINT `fk_Subasta_Estado`
    FOREIGN KEY (`idEstadoSubasta`) REFERENCES `estado_subasta` (`id`),
  CONSTRAINT `fk_Subasta_Objeto`
    FOREIGN KEY (`idObjeto`) REFERENCES `objeto` (`id`),
  CONSTRAINT `fk_Subasta_Vendedor`
    FOREIGN KEY (`idVendedor`) REFERENCES `usuario` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `puja`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `puja` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idSubasta` INT(11) NOT NULL,
  `idUsuario` INT(11) NOT NULL,
  `monto` DECIMAL(15,2) NOT NULL,
  `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `fk_Puja_Subasta` (`idSubasta` ASC),
  INDEX `fk_Puja_Usuario` (`idUsuario` ASC),
  CONSTRAINT `fk_Puja_Subasta`
    FOREIGN KEY (`idSubasta`) REFERENCES `subasta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_Puja_Usuario`
    FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `resultado_subasta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `resultado_subasta` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idSubasta` INT(11) NOT NULL,
  `idUsuarioGanador` INT(11) NOT NULL,
  `idPujaGanadora` INT(11) NOT NULL,
  `montoFinal` DECIMAL(15,2) NOT NULL,
  `fechaCierre` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idSubasta_UNIQUE` (`idSubasta` ASC),
  INDEX `fk_Resultado_Puja` (`idPujaGanadora` ASC),
  INDEX `fk_Resultado_Usuario` (`idUsuarioGanador` ASC),
  CONSTRAINT `fk_Resultado_Puja`
    FOREIGN KEY (`idPujaGanadora`) REFERENCES `puja` (`id`),
  CONSTRAINT `fk_Resultado_Subasta`
    FOREIGN KEY (`idSubasta`) REFERENCES `subasta` (`id`),
  CONSTRAINT `fk_Resultado_Usuario`
    FOREIGN KEY (`idUsuarioGanador`) REFERENCES `usuario` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pago` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idResultado` INT(11) NOT NULL,
  `montoPagado` DECIMAL(15,2) NOT NULL,
  `fechaPago` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `idEstadoPago` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idResultado_UNIQUE` (`idResultado` ASC),
  INDEX `fk_Pago_Estado` (`idEstadoPago` ASC),
  CONSTRAINT `fk_Pago_Estado`
    FOREIGN KEY (`idEstadoPago`) REFERENCES `estado_pago` (`id`),
  CONSTRAINT `fk_Pago_Resultado`
    FOREIGN KEY (`idResultado`) REFERENCES `resultado_subasta` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `recuperacion_contrasenna`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recuperacion_contrasenna` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idUsuario` INT(11) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `fechaExpiracion` DATETIME NOT NULL,
  `usado` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idUsuario` (`idUsuario` ASC),
  CONSTRAINT `recuperacion_contrasenna_ibfk_1`
    FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARACTER SET = utf8;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
