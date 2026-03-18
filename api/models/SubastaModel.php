<?php
class SubastaModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function getActivas() {
        $objetoM = new ObjetoModel();
        
        // 1. Consulta simple: Solo subastas con estado 1 (activa)
        $vSQL = "SELECT * FROM subasta WHERE idEstadoSubasta = 1 ORDER BY fechaInicio DESC;";
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if(!empty($vResultado) && is_array($vResultado)){
            for ($i=0; $i < count($vResultado); $i++) { 
                // 2. Composición: Pedimos los datos del objeto al ObjetoModel
                $datosObjeto = $objetoM->get($vResultado[$i]->idObjeto);
                
                // 3. Asignamos las propiedades necesarias para el listado
                $vResultado[$i]->nombreObjeto = $datosObjeto->nombreObjeto;
                // Obtenemos solo la primera imagen para el listado
                $vResultado[$i]->imagen = $datosObjeto->imagenes[0]->nombreImagen; 
                
                // 4. Campo calculado: Conteo de pujas
                $vResultado[$i]->cantidadPujas = $this->countPujas($vResultado[$i]->id);
            }
        }
        return $vResultado;
    }

    private function countPujas($idSubasta) {
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

    if(!empty($vResultado) && is_array($vResultado)){
        for ($i=0; $i < count($vResultado); $i++) { 
            // 2. Composición: Traemos la info del objeto (nombre e imagen)
            $datosObjeto = $objetoM->get($vResultado[$i]->idObjeto);
            
            $vResultado[$i]->nombreObjeto = $datosObjeto->nombreObjeto;
            $vResultado[$i]->imagen = $datosObjeto->imagenes[0]->nombreImagen; 
            
            // 3. Composición: Traemos el texto del estado (Finalizada/Cancelada)
            $vResultado[$i]->estadoNombre = $this->getNombreEstado($vResultado[$i]->idEstadoSubasta);
            
            // 4. Campo calculado: Conteo de pujas
            $vResultado[$i]->cantidadPujas = $this->countPujas($vResultado[$i]->id);
        }
    }
    return $vResultado;
}

// Método auxiliar para obtener la descripción del estado sin JOIN
private function getNombreEstado($idEstado) {
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

    if(!empty($vResultado)){
        $vResultado = $vResultado[0];

        // 2. INFORMACIÓN DEL OBJETO: Nombre, Imagen, Categorías, Condición
        // El ObjetoModel ya se encarga de traer todo esto por separado
        $vResultado->objeto = $objetoM->get($vResultado->idObjeto);

        // 3. DATOS DE LA SUBASTA: Estado actual
        $vResultado->estadoNombre = $this->getNombreEstado($vResultado->idEstadoSubasta);

        // 4. CAMPO CALCULADO: Cantidad total de pujas
        $vResultado->historialPujas = $this->getHistorialPujas($id);
        $vResultado->cantidadPujas = count($vResultado->historialPujas);

        // 5. DATOS DEL VENDEDOR (Extra para el detalle)
        $vResultado->vendedor = $usuarioM->get($vResultado->idVendedor);
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
            ORDER BY monto ASC;";
            
    $vResultado = $this->enlace->executeSQL($vSql);

    // 3. Validamos que el resultado sea un array antes de procesar
    if(!empty($vResultado) && is_array($vResultado)){
        foreach ($vResultado as $puja) {
            // Composición: Obtener datos del usuario desde UsuarioModel
            $datosUser = $usuarioM->get($puja->idUsuario);
            
            if($datosUser) {
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

        public function UsuarioCreadorSubastas($idUsuario){
            $vSql = "SELECT s.id
            FROM subasta s, usuario u
            WHERE u.id=s.idVendedor and u.id=$idUsuario;";

            $vResultado = $this->enlace->ExecuteSQL($vSql);

            return (!empty($vResultado) && is_array($vResultado)) ? $vResultado : [];
        }



    /**
 * Verifica si un objeto ya está en una subasta activa
 */
private function tieneSubastaActiva($idObjeto) {
    $sql = "SELECT COUNT(*) as total FROM subasta 
            WHERE idObjeto = $idObjeto AND idEstadoSubasta = 1";
    $res = $this->enlace->executeSQL($sql);
    return ($res[0]->total > 0);
}

/**
 * Verifica si un objeto está en estado "Activo" (idEstadoObjeto = 1)
 */
private function objetoEstaActivo($idObjeto) {
    $sql = "SELECT idEstadoObjeto FROM objeto WHERE id = $idObjeto";
    $res = $this->enlace->executeSQL($sql);
    return (!empty($res) && $res[0]->idEstadoObjeto == 1);
}

//crear subasta
public function create($objeto)
{
    try {
        // 1. LIMPIEZA TÉCNICA DE FECHAS
        // HTML5 envía 'T' entre fecha y hora; MySQL requiere espacio
        $fInicioRaw = str_replace('T', ' ', $objeto->fechaInicio);
        $fCierreRaw = str_replace('T', ' ', $objeto->fechaCierre);

        // A. VALIDACIÓN DE FECHAS (Tu lógica original intacta)
        $ahora = new DateTime();
        $fInicio = new DateTime($fInicioRaw);
        $fCierre = new DateTime($fCierreRaw);

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
        $sqlObjeto = "UPDATE objeto SET idEstadoObjeto = 3 WHERE id = $objeto->idObjeto";
        $this->enlace->executeSQL($sqlObjeto);

        return $this->get($idSubasta);

    } catch (Exception $e) {
        throw $e;
    }
}
//publicar subasta
public function publicar($id) {
    // Validar que la subasta exista y sea borrador
    $subasta = $this->get($id);
    if (!$subasta || $subasta->idEstadoSubasta != 4) {
        throw new Exception("Solo se pueden publicar subastas en estado Borrador.");
    }

    // Validar fecha de inicio
    if (strtotime($subasta->fechaInicio) < time()) {
        throw new Exception("La fecha de inicio debe ser futura para poder publicar.");
    }

    $vSql = "UPDATE subasta SET idEstadoSubasta = 1 WHERE id = $id;";
    return $this->enlace->executeSQL($vSql);
}
//cancelar subasta
public function cancelar($id) {
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
    return $this->enlace->executeSQL($vSql);
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
        }
    }
    return $vResultado;
}

// Editar subasta (solo si está en estado Borrador)
public function update($objeto)
{
    // Validar regla de negocio: Solo editar si es borrador (Estado 4)
    $subastaActual = $this->get($objeto->id);
    if($subastaActual->idEstadoSubasta != 4){
        throw new Exception("No se puede editar una subasta que ya ha sido publicada o cancelada.");
    }

    //Formatear fechas antes del UPDATE
    $fechaInicio = date('Y-m-d H:i:s', strtotime($objeto->fechaInicio));
    $fechaCierre = date('Y-m-d H:i:s', strtotime($objeto->fechaCierre));

    $vSql = "UPDATE subasta SET 
            fechaInicio = '$objeto->fechaInicio',
            fechaCierre = '$objeto->fechaCierre',
            precioBase = $objeto->precioBase,
            incremento = $objeto->incremento
            WHERE id = $objeto->id;";

    $this->enlace->executeSQL_DML($vSql);

    // Retornar el objeto actualizado
    return $this->get($objeto->id);
}
}