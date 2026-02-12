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
        SELECT u.nombreUsuario, r.nombreRol AS rol, e.descripcionEstado AS estado
        FROM usuario u
        INNER JOIN rol r ON r.id = u.IdRol
        INNER JOIN estado_usuario e ON e.id = u.IdEstado;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    //Obtener detalle de cada usuario
    public function DetalleUsuarios($id)
    {
        $subastaM = new SubastaModel();
        $pujaM = new PujaModel();

        $vSql = "SELECT 
        u.id, u.nombreUsuario, r.nombreRol, e.descripcionEstado, u.fecha_registro
        FROM usuario u
        INNER JOIN rol r ON r.id = u.IdRol
        INNER JOIN estado_usuario e ON e.id = u.IdEstado
        WHERE u.id=$id;";

        $vResultado = $this->enlace->executeSQL($vSql);

    if(!empty($vResultado)&& is_array($vResultado)){
        $vResultado = $vResultado[0];

        //Subastas creadas
        $subasta = $subastaM->UsuarioCreadorSubastas($vResultado->id);
        $vResultado->numerosubastas= count($subasta);

        $puja = $pujaM->UsuariosPujadores($vResultado->id);
        $vResultado->numeropujas = count($puja);

        return $vResultado;
    }
    return null;
    }
}
