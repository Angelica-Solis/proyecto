<?php
class ObjetoImagenModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // listado de objetos (solo una imagen)
    public function getPrimeraImagen($idObjeto)
    {
        $vSql = "SELECT nombreImagen FROM objeto_imagen 
                WHERE idObjeto = $idObjeto LIMIT 1;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return (!empty($vResultado)) ? $vResultado[0]->nombreImagen : "default.jpg";
    }

    // se usa para el detalle (todas las imágenes)
    public function getImagenesPorObjeto($idObjeto)
    {
        $vSql = "SELECT nombreImagen FROM objeto_imagen WHERE idObjeto = $idObjeto;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }
}