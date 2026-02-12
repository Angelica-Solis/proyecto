<?php
class StatusModel{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }

    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM estado_usuario where id=$id;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function getStatusUser($idUser)
    {
        //Consulta sql
        $vSql = "SELECT e.id, e.descripcionEstado
            FROM estado_usuario e,usuario u 
            where e.id=u.IdEstado and u.id=$idUser;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
}