<?php
class RolModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }


    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM rol where id=$id;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function getRolUser($idUser)
    {
        //Consulta sql
        $vSql = "SELECT r.id, r.nombreRol
            FROM rol r,usuario u 
            where r.id=u.IdRol and u.id=$idUser;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
}
