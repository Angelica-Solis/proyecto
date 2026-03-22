<?php
class CategoriaModel
{

 public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

public function getCategorias()
{
    $sql = "SELECT id, nombreCategoria FROM categoria";
    return $this->enlace->executeSQL($sql);
}

    
}