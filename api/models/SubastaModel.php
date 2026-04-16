<?php
class SubastaModel
{
    
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getActivas()
    {
        $objetoM = new ObjetoModel();
        // Antes de listar, verificamos si hay subastas que deban cerrarse por fecha
        $this->enlace->executeSQL_DML("
            UPDATE subasta 
            SET idEstadoSubasta = 2 
            WHERE idEstadoSubasta = 1 
            AND fechaCierre <= NOW()
        ");
        // 1. Consulta simple: Solo subastas con estado 1 (activa)
        $vSQL = "SELECT * FROM subasta WHERE idEstadoSubasta = 1 ORDER BY fechaInicio DESC;";
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                // 2. Composición: Pedimos los datos del objeto al ObjetoModel
                $datosObjeto = $objetoM->get($vResultado[$i]->idObjeto);

                // 3. Asignamos las propiedades necesarias para el listado
                $vResultado[$i]->nombreObjeto = $datosObjeto->nombreObjeto;
                // Obtenemos solo la primera imagen para el listado
                $vResultado[$i]->imagen = (!empty($datosObjeto->imagenes) && isset($datosObjeto->imagenes[0]->nombreImagen))
                    ? $datosObjeto->imagenes[0]->nombreImagen
                    : null;

                // 4. Campo calculado: Conteo de pujas
                $vResultado[$i]->cantidadPujas = $this->countPujas($vResultado[$i]->id);
            }
        }
        return $vResultado;
    }

    private function countPujas($idSubasta)
    {
        $sql = "SELECT COUNT(*) as total FROM puja WHERE idSubasta = $idSubasta";
        $res = $this->enlace->executeSQL($sql);
        return $res[0]->total;
    }


    /**
     * Listar subastas finalizadas o canceladas
     */
    public function getFinalizadas()
    {
        $objetoM = new ObjetoModel();

        // 1. Consulta simple: filtrar por estados 2 (Finalizada) y 3 (Cancelada)
        $vSQL = "SELECT * FROM subasta 
            WHERE idEstadoSubasta IN (2, 3) 
            ORDER BY fechaCierre DESC;";

        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                // 2. Composición: Traemos la info del objeto (nombre e imagen)
                $datosObjeto = $objetoM->get($vResultado[$i]->idObjeto);

                $vResultado[$i]->nombreObjeto = $datosObjeto->nombreObjeto;
                $vResultado[$i]->imagen = (!empty($datosObjeto->imagenes) && isset($datosObjeto->imagenes[0]->nombreImagen))
                    ? $datosObjeto->imagenes[0]->nombreImagen
                    : null;

                // 3. Composición: Traemos el texto del estado (Finalizada/Cancelada)
                $vResultado[$i]->estadoNombre = $this->getNombreEstado($vResultado[$i]->idEstadoSubasta);

                // 4. Campo calculado: Conteo de pujas
                $vResultado[$i]->cantidadPujas = $this->countPujas($vResultado[$i]->id);
            }
        }
        return $vResultado;
    }

    // Método auxiliar para obtener la descripción del estado sin JOIN
    private function getNombreEstado($idEstado)
    {
        $sql = "SELECT descripcionEstado FROM estado_subasta WHERE id = $idEstado";
        $res = $this->enlace->executeSQL($sql);
        return (!empty($res)) ? $res[0]->descripcionEstado : "Desconocido";
    }


    /**
     * Obtener detalle completo de una subasta por ID
     */
    public function get($id)
    {
        $objetoM = new ObjetoModel();
        $usuarioM = new UsuarioModel();

        // 1. Consulta simple a la subasta
        $vSql = "SELECT * FROM subasta WHERE id=$id;";
        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];

            // 2. INFORMACIÓN DEL OBJETO
            $vResultado->objeto = $objetoM->get($vResultado->idObjeto);

            // 3. DATOS DE LA SUBASTA: Estado actual
            $vResultado->estadoNombre = $this->getNombreEstado($vResultado->idEstadoSubasta);

            // 4. CAMPO CALCULADO: Cantidad total de pujas
            $vResultado->historialPujas = $this->getHistorialPujas($id);
            $vResultado->cantidadPujas = count($vResultado->historialPujas);

            // 5. DATOS DEL VENDEDOR
            $vResultado->vendedor = $usuarioM->get($vResultado->idVendedor);

            // 6. Si la subasta está finalizada, traemos el resultado y pago
            if ($vResultado->idEstadoSubasta == 2) {
                try {
                    $sqlPago = "SELECT p.*, rs.montoFinal, rs.idUsuarioGanador 
                                FROM pago p 
                                JOIN resultado_subasta rs ON p.idResultado = rs.id 
                                WHERE rs.idSubasta = $id 
                                LIMIT 1";
                    $resPago = $this->enlace->executeSQL($sqlPago);
                    $vResultado->pago = (!empty($resPago)) ? $resPago[0] : null;
                    
                    // Log para depuración
                    error_log("Subasta $id finalizada. Pago: " . ($vResultado->pago ? 'Existe' : 'No existe'));
                } catch (Exception $e) {
                    error_log("Error al obtener pago para subasta $id: " . $e->getMessage());
                    $vResultado->pago = null;
                }
            }
        }

        return $vResultado;
    }

    /**
     * Obtener historial detallado de pujas de una subasta específica
     * Orden cronológico, validación por ID y composición de usuario.
     */
    public function getHistorialPujas($idSubasta)
    {
        $usuarioM = new UsuarioModel();

        // 1. Consulta con ORDEN CRONOLÓGICO: Descendente (más recientes primero)
        // 2. VALIDACIÓN: Filtrado estricto por idSubasta
        $vSql = "SELECT monto, fechaHora, idUsuario 
            FROM puja 
            WHERE idSubasta = $idSubasta 
            ORDER BY monto DESC;";

        $vResultado = $this->enlace->executeSQL($vSql);

        // 3. Validamos que el resultado sea un array antes de procesar
        if (!empty($vResultado) && is_array($vResultado)) {
            foreach ($vResultado as $puja) {
                // Composición: Obtener datos del usuario desde UsuarioModel
                $datosUser = $usuarioM->get($puja->idUsuario);

                if ($datosUser) {
                    $puja->nombreUsuario = $datosUser->nombreUsuario;
                } else {
                    $puja->nombreUsuario = "Usuario no identificado";
                }
            }
        } else {
            // Retornar array vacío evita errores en count() o foreach externos
            $vResultado = [];
        }

        return $vResultado;
    }
    //Obtener las subastas por usuario

    public function UsuarioCreadorSubastas($idUsuario)
    {
        $vSql = "SELECT s.id
            FROM subasta s, usuario u
            WHERE u.id=s.idVendedor and u.id=$idUsuario;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return (!empty($vResultado) && is_array($vResultado)) ? $vResultado : [];
    }



    /**
     * Verifica si un objeto ya está en una subasta activa
     */
    private function tieneSubastaActiva($idObjeto)
    {
        $sql = "SELECT COUNT(*) as total FROM subasta 
            WHERE idObjeto = $idObjeto AND idEstadoSubasta = 1";
        $res = $this->enlace->executeSQL($sql);
        return ($res[0]->total > 0);
    }

    /**
     * Verifica si un objeto está en estado "Activo" (idEstadoObjeto = 1)
     */
    private function objetoEstaActivo($idObjeto)
    {
        $sql = "SELECT idEstadoObjeto FROM objeto WHERE id = $idObjeto";
        $res = $this->enlace->executeSQL($sql);
        return (!empty($res) && $res[0]->idEstadoObjeto == 1);
    }

    //crear subasta
    public function create($objeto)
    {
        try {
            // 1. LIMPIEZA TÉCNICA DE FECHAS
            $fInicioRaw = str_replace('T', ' ', $objeto->fechaInicio);
            $fCierreRaw = str_replace('T', ' ', $objeto->fechaCierre);
            // A. VALIDACIÓN DE FECHAS 
            $ahora = new DateTime();
            $fInicio = new DateTime($objeto->fechaInicio);
            $fCierre = new DateTime($objeto->fechaCierre);

            if ($fInicio < $ahora) {
                throw new Exception("La fecha de inicio no puede ser anterior a la actual.");
            }
            if ($fCierre <= $fInicio) {
                throw new Exception("La fecha de cierre debe ser posterior a la de inicio.");
            }

            // B. VALIDACIÓN DE DISPONIBILIDAD (Evitar colisiones)
            $sqlCheck = "SELECT COUNT(*) as conteo FROM subasta 
                    WHERE idObjeto = $objeto->idObjeto 
                    AND idEstadoSubasta IN (1, 4)";

            $check = $this->enlace->executeSQL($sqlCheck);

            // Manejo del error 'num_rows on bool'
            if ($check === false) {
                throw new Exception("Error al verificar la disponibilidad del objeto en la base de datos.");
            }

            if ($check[0]->conteo > 0) {
                throw new Exception("Este objeto ya tiene una subasta programada o en borrador.");
            }

            // C. INSERTAR LA SUBASTA
            $vSql = "INSERT INTO subasta (idObjeto, idVendedor, fechaInicio, fechaCierre, 
                precioBase, incrementoMinimo, idEstadoSubasta) 
                VALUES ($objeto->idObjeto, $objeto->idVendedor, '$fInicioRaw', 
                '$fCierreRaw', $objeto->precioBase, $objeto->incremento, 4);";

            $idSubasta = $this->enlace->executeSQL_DML_last($vSql);

            if (!$idSubasta) {
                throw new Exception("No se pudo registrar la subasta. Verifica los datos.");
            }

            // D. ACTUALIZAR ESTADO DEL OBJETO
            $sqlObjeto = "UPDATE objeto SET idEstadoObjeto = 2 WHERE id = $objeto->idObjeto";
            $this->enlace->executeSQL_DML($sqlObjeto);

            return $this->get($idSubasta);
        } catch (Exception $e) {
            throw $e;
        }
    }
    //publicar subasta
    public function publicar($id)
    {
        $subasta = $this->get($id);

        if (!$subasta || $subasta->idEstadoSubasta != 4) {
            throw new Exception("Solo se pueden publicar subastas en estado Borrador.");
        }

        $inicio = new DateTime($subasta->fechaInicio);
        $ahora = new DateTime();

        // margen de seguridad (2 minutos)
        $margenSegundos = 120;

        if (($inicio->getTimestamp() - $ahora->getTimestamp()) < $margenSegundos) {
            throw new Exception("La subasta debe iniciar al menos en 2 minutos para poder publicarse.");
        }

        $vSql = "UPDATE subasta SET idEstadoSubasta = 1 WHERE id = $id;";
        return $this->enlace->executeSQL_DML($vSql);
    }
    //cancelar subasta
    public function cancelar($id)
    {
        // Contar pujas usando el método que ya optimizamos
        $cantidadPujas = $this->countPujas($id);

        $subasta = $this->get($id);

        if ($cantidadPujas > 0) {
            throw new Exception("No se puede cancelar una subasta que ya tiene pujas.");
        }

        if (strtotime($subasta->fechaInicio) <= time() && $subasta->idEstadoSubasta == 1) {
            throw new Exception("La subasta ya ha iniciado y no puede cancelarse.");
        }

        $vSql = "UPDATE subasta SET idEstadoSubasta = 3 WHERE id = $id;"; // 3 = Cancelada
        return $this->enlace->executeSQL_DML($vSql);
    }
    // Listar todas las subastas
    public function all()
    {
        $vSql = "SELECT * FROM subasta ORDER BY id DESC;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i <= count($vResultado) - 1; $i++) {
                // Reutilizar el get($id) para cargar composiciones
                $vResultado[$i] = $this->get($vResultado[$i]->id);
                // Para obtener la imagen para el frontend
                $vResultado[$i]->imagen = (!empty($vResultado[$i]->objeto->imagenes)
                    && isset($vResultado[$i]->objeto->imagenes[0]->nombreImagen))
                    ? $vResultado[$i]->objeto->imagenes[0]->nombreImagen
                    : null;
            }
        }
        return $vResultado;
    }

    // Editar subasta (solo si está en estado Borrador)
    public function update($objeto)
    {
        try {
            // 1. Definir la zona horaria una sola vez para evitar conflictos
            $tz = new DateTimeZone('America/Costa_Rica');
            $ahora = new DateTime("now", $tz);

            $subastaActual = $this->get($objeto->id);
            $cantidadPujas = $this->countPujas($objeto->id);

            // 2. Parsear la fecha de BD (MySQL la guarda sin TZ, hay que asignársela)
            $fechaInicioActual = new DateTime($subastaActual->fechaInicio, $tz);

            if ($fechaInicioActual <= $ahora) {
                throw new Exception("No se puede editar una subasta que ya está en curso.");
            }

            if ($cantidadPujas > 0) {
                throw new Exception("No se puede editar: esta subasta ya tiene pujas.");
            }

            // 3. Crear las NUEVAS fechas usando explícitamente la misma zona horaria ($tz)
            $fInicioNueva = new DateTime(str_replace('T', ' ', $objeto->fechaInicio), $tz);
            $fCierreNueva = new DateTime(str_replace('T', ' ', $objeto->fechaCierre), $tz);

            // --- VALIDACIÓN QUE ESTABA FALLANDO ---
            if ($fInicioNueva < $ahora) {
                throw new Exception("La nueva fecha de inicio no puede ser anterior a la actual.");
            }

            if ($fCierreNueva <= $fInicioNueva) {
                throw new Exception("La nueva fecha de cierre debe ser posterior a la de inicio.");
            }

            $fInicioSQL = $fInicioNueva->format('Y-m-d H:i:s');
            $fCierreSQL = $fCierreNueva->format('Y-m-d H:i:s');

            // 4. Update (Verifica si el campo es incrementoMinimo o montoIncremento)
            $vSql = "UPDATE subasta SET 
                    fechaInicio = '$fInicioSQL',
                    fechaCierre = '$fCierreSQL',
                    precioBase = $objeto->precioBase,
                    incrementoMinimo = $objeto->incremento 
                    WHERE id = $objeto->id;";

            $this->enlace->executeSQL_DML($vSql);

            return $this->get($objeto->id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    //verificar y cerrar subasta
        public function verificarYCerrar($id) {
    try {
        // 1. Consultamos la subasta
        $vSql = "SELECT fechaCierre, idEstadoSubasta, idObjeto FROM subasta WHERE id = $id";
        $res = $this->enlace->executeSQL($vSql);
        
        if (empty($res)) return false;

        $subasta = $res[0];

        $tz = new DateTimeZone('America/Costa_Rica');
        $ahora = new DateTime("now", $tz);
        $cierre = new DateTime($subasta->fechaCierre, $tz);

        // 2. Validar cierre
        if ($ahora >= $cierre && $subasta->idEstadoSubasta == 1) {

            // 🔹 Cerrar subasta
            $this->enlace->executeSQL_DML("UPDATE subasta SET idEstadoSubasta = 2 WHERE id = $id");

            // 🔹 Actualizar objeto a vendido
            $this->enlace->executeSQL_DML("UPDATE objeto SET idEstadoObjeto = 3 WHERE id = $subasta->idObjeto");

            // 🔴 VALIDAR SI YA EXISTE RESULTADO
            $sqlExiste = "SELECT COUNT(*) as total FROM resultado_subasta WHERE idSubasta = $id";
            $existe = $this->enlace->executeSQL($sqlExiste);

            if (!empty($existe) && $existe[0]->total == 0) {

                // 🔹 Obtener puja ganadora
                $sqlPuja = "SELECT id, monto, idUsuario 
                            FROM puja 
                            WHERE idSubasta = $id 
                            ORDER BY monto DESC 
                            LIMIT 1";

                $puja = $this->enlace->executeSQL($sqlPuja);

                if (!empty($puja)) {
                    $puja = $puja[0];
                    
                    // Log para depuración
                    error_log("Puja encontrada - ID: {$puja->id}, Usuario: {$puja->idUsuario}, Monto: {$puja->monto}");

                    // 🔹 Verificar que no exista ya un resultado para esta puja
                    $sqlCheckResultado = "SELECT id FROM resultado_subasta WHERE idPujaGanadora = {$puja->id}";
                    $checkResultado = $this->enlace->executeSQL($sqlCheckResultado);
                    
                    if (empty($checkResultado)) {
                        // 🔹 Crear resultado
                        $sqlResultado = "INSERT INTO resultado_subasta 
                            (idSubasta, idUsuarioGanador, idPujaGanadora, montoFinal)
                            VALUES ($id, {$puja->idUsuario}, {$puja->id}, {$puja->monto})";

                        $idResultado = $this->enlace->executeSQL_DML_last($sqlResultado);
                        
                        error_log("Resultado creado con ID: $idResultado");

                        // 🔹 Crear pago
                        $sqlPago = "INSERT INTO pago 
                            (idResultado, montoPagado, idEstadoPago)
                            VALUES ($idResultado, {$puja->monto}, 1)";

                        $this->enlace->executeSQL_DML($sqlPago);
                        
                        error_log("Pago creado exitosamente");
                    } else {
                        error_log("Ya existe un resultado para esta puja");
                    }
                } else {
                    error_log("No se encontraron pujas para la subasta $id");
                }
            }

            return true;
        }

    } catch (Exception $e) {
        error_log("ERROR en verificarYCerrar: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        throw $e; // Relanzar para que el controller lo capture
    }

    return false;
}
}
