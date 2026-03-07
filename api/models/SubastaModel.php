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
            ORDER BY fechaHora DESC;";
            
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
}