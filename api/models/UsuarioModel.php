<?php
class UsuarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM usuario;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar el objeto
        return $vResultado;
    }

    public function get($id)
    {
        // Traemos solo datos públicos por seguridad
        $vSql = "SELECT id, nombreUsuario, emailUsuario FROM usuario WHERE id=$id;";
        $vResultado = $this->enlace->executeSQL($vSql);
        return (!empty($vResultado)) ? $vResultado[0] : null;
    }
    //Listado de usuarios mostrando solo rol, estado y nombre del usuario
    public function RolEstadoUsuarios()
    {
        $vSql = "
        SELECT u.id, u.nombreUsuario, r.nombreRol AS rol, e.descripcionEstado AS estado
        FROM usuario u
        INNER JOIN rol r ON r.id = u.IdRol
        INNER JOIN estado_usuario e ON e.id = u.IdEstado
        ORDER BY id DESC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    //Obtener detalle de cada usuario
    public function DetalleUsuarios($id)
{
    // 1. Información básica (REQUERIDO: Nombre, Rol, Estado, Fecha)
    $vSql = "SELECT u.id, u.nombreUsuario, r.nombreRol, e.descripcionEstado, u.fecha_registro, u.emailUsuario
            FROM usuario u
            INNER JOIN rol r ON r.id = u.IdRol
            INNER JOIN estado_usuario e ON e.id = u.IdEstado
            WHERE u.id = $id;";

    $vResultado = $this->enlace->executeSQL($vSql);

    if (!empty($vResultado)) {
        $usuario = $vResultado[0];
        
        // 2. Campos Calculados
        // Conteo de Subastas creadas
        $sqlCountSubastas = "SELECT COUNT(*) as total FROM subasta WHERE idVendedor = $id";
        $resSub = $this->enlace->executeSQL($sqlCountSubastas);
        $usuario->cantidadSubastas = $resSub[0]->total;

        // Conteo de Pujas realizadas
        $sqlCountPujas = "SELECT COUNT(*) as total FROM puja WHERE idUsuario = $id";
        $resPuja = $this->enlace->executeSQL($sqlCountPujas);
        $usuario->cantidadPujas = $resPuja[0]->total;

        // 3. Historial detallado
        $usuario->actividad = [];
        if ($usuario->nombreRol == 'Vendedor') {
            $sqlVendedor = "SELECT o.nombreObjeto as titulo, s.precioBase as monto, s.fechaInicio as fecha
                            FROM subasta s
                            INNER JOIN objeto o ON s.idObjeto = o.id
                            WHERE s.idVendedor = $id
                            ORDER BY s.fechaInicio DESC";
            $usuario->actividad = $this->enlace->executeSQL($sqlVendedor) ?: [];
        } else {
            $sqlComprador = "SELECT o.nombreObjeto as titulo, p.monto, p.fechaHora as fecha
                            FROM puja p
                            INNER JOIN subasta s ON p.idSubasta = s.id
                            INNER JOIN objeto o ON s.idObjeto = o.id
                            WHERE p.idUsuario = $id
                            ORDER BY p.fechaHora DESC";
            $usuario->actividad = $this->enlace->executeSQL($sqlComprador) ?: [];
        }

        return $usuario;
    }
    return null;
}
}
