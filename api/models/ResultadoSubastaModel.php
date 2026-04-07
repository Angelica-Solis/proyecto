<?php
class ResultadoSubastaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function get($id)
    {
        $sql = "SELECT id, idSubasta, idUsuarioGanador, idPujaGanadora, montoFinal, fechaCierre FROM resultado_subasta WHERE id=$id";
        $res = $this->enlace->executeSQL($sql);
        return $res;
    }
}
