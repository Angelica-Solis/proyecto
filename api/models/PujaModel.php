<?php

class PujaModel
{

    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }


    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM puja where id=$id;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    //Obtener pujas por usuario
    public function UsuariosPujadores($idUsuario)
    {
        $vSql = "SELECT p.id
            FROM puja p, usuario u
            WHERE u.id=p.idUsuario and u.id=$idUsuario;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return (!empty($vResultado) && is_array($vResultado)) ? $vResultado : [];
    }
}
